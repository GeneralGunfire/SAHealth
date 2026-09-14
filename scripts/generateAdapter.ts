/**
 * AI-assisted adapter draft generator (Backend_Research.docx Section 8.1,
 * second named core innovation). A DEVELOPMENT-TIME CLI tool only — never
 * imported by, or run as part of, the running backend. It has a hard
 * runtime dependency on OmniRoute (a local multi-provider LLM router
 * already running on this machine for a separate project, "Udaan") being
 * up at http://localhost:20128; the backend itself has no such dependency
 * and never calls this code.
 *
 * Usage:
 *   npm run generate-adapter -- --source=<name> --sample=<path-to-json>
 *
 * Output is written ONLY under src/adapters/_drafts/<source>/ — never into
 * src/adapters/ itself, so a draft can never be auto-discovered by
 * src/core/registry.ts's filesystem scan. Moving a draft into src/adapters/
 * to make it real is a manual, deliberate developer action (a file move),
 * never performed by this tool.
 *
 * OmniRoute contract used here (confirmed by reading Udaan's own working
 * client at C:\Udaan\src\integrations\omniroute\client.ts — read-only,
 * nothing in Udaan was modified to build this tool):
 *   POST http://localhost:20128/v1/chat/completions
 *   Headers: Authorization: Bearer <OMNIROUTE_API_KEY>, Content-Type: application/json
 *   Body: { model, messages, stream: false }
 *   Response: standard OpenAI chat.completion shape —
 *     data.choices[0].message.content
 *     data.model  <-- the ACTUAL underlying model OmniRoute routed to
 *                      (observed to return an internal codename like
 *                      "big-pickle", not a public model name — logged
 *                      verbatim in the draft header regardless, per the
 *                      "log whatever OmniRoute reports" requirement)
 *   Reachability check: GET /v1/models with the same bearer token.
 *   model="auto/best-coding": one of OmniRoute's own router aliases,
 *   selected here (rather than "auto/smart", which Udaan uses for general
 *   chat) because this tool's whole job is code generation.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const OMNIROUTE_URL = "http://localhost:20128";
// Same local, non-third-party key documented in Udaan's own client (a
// per-daemon local key, not a hosted-provider secret) — required because
// this OmniRoute instance has REQUIRE_API_KEY set. If this key stops
// working, a fresh one must be issued via OmniRoute's own `POST /api/keys`
// and updated here, same as documented in Udaan's client.ts.
const OMNIROUTE_API_KEY = process.env.OMNIROUTE_API_KEY ?? "sk-14107f74a8640555-65d45e-aab45f13";
const MODEL = "auto/best-coding";

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const CANONICAL_DIR = path.join(REPO_ROOT, "src", "canonical");
const REFERENCE_ADAPTER_DIR = path.join(REPO_ROOT, "src", "adapters", "dhis2-style-c");
const SOURCE_ADAPTER_TYPES_PATH = path.join(REPO_ROOT, "src", "types", "sourceAdapter.ts");
const DRAFTS_DIR = path.join(REPO_ROOT, "src", "adapters", "_drafts");

function parseArgs(argv: string[]): { source: string; sample: string } {
  const args: Record<string, string> = {};
  for (const arg of argv) {
    const match = /^--([\w-]+)=(.*)$/.exec(arg);
    if (match) args[match[1]] = match[2];
  }
  if (!args.source || !args.sample) {
    throw new Error(
      "Usage: npm run generate-adapter -- --source=<name> --sample=<path-to-json>\n" +
        "  --source: a short kebab-case identifier for the new source, e.g. pharmacy-e\n" +
        "  --sample: path to a JSON file with a handful of representative native records"
    );
  }
  return { source: args.source, sample: args.sample };
}

async function checkOmniRouteReachable(): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${OMNIROUTE_URL}/v1/models`, {
      headers: { Authorization: `Bearer ${OMNIROUTE_API_KEY}` },
      signal: AbortSignal.timeout(3000),
    });
  } catch (err) {
    throw new Error(
      `Cannot reach OmniRoute at ${OMNIROUTE_URL}. This tool has a hard dependency on it running locally ` +
        `(unlike the backend itself, which has no AI dependency at runtime). ` +
        `Start it with: omniroute serve --daemon --no-open\n` +
        `Underlying error: ${err instanceof Error ? err.message : String(err)}`
    );
  }
  if (!response.ok) {
    throw new Error(
      `OmniRoute responded but rejected the request (${response.status} ${response.statusText}). ` +
        `Check OMNIROUTE_API_KEY is correct for this local instance.`
    );
  }
}

/**
 * OmniRoute's free-tier backends fail a large fraction of requests with
 * transient/upstream-exhaustion statuses (documented directly in Udaan's
 * own client, based on measured 55-80%+ failure rates across real usage) —
 * reusing that project's own retry set here rather than guessing at one,
 * since it is proven behaviour against this exact daemon.
 */
const RETRYABLE_STATUSES = new Set([400, 401, 429, 499, 502, 503]);
const MAX_RETRIES = 2;

interface ChatResult {
  content: string;
  modelReported: string;
}

async function callOmniRoute(prompt: string): Promise<ChatResult> {
  let lastStatus: number | undefined;
  let lastNetworkError: string | undefined;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let response: Response;
    try {
      response = await fetch(`${OMNIROUTE_URL}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OMNIROUTE_API_KEY}` },
        body: JSON.stringify({
          model: MODEL,
          stream: false,
          messages: [{ role: "user", content: prompt }],
        }),
        // Measured directly against this OmniRoute instance: a large INPUT
        // prompt (~21,000 chars — the full canonical schemas + reference
        // adapter this tool embeds) completes in ~3.5s when the requested
        // OUTPUT is short. The actual bottleneck is OUTPUT length: a request
        // for ~60 lines of generated code took ~100s on the routed backend
        // (which streams a verbose internal `reasoning_content` chain-of-
        // thought that appears to scale with output length). This tool asks
        // for two full files (a translate function + a test suite), easily
        // 150-250+ lines combined, so a proportionally much longer timeout
        // is needed — this is measured free-tier backend behaviour, not a
        // guessed value.
        signal: AbortSignal.timeout(360_000),
      });
    } catch (err) {
      lastNetworkError = err instanceof Error ? err.message : String(err);
      if (attempt === MAX_RETRIES) {
        throw new Error(
          `OmniRoute request failed after ${MAX_RETRIES + 1} attempts (network-level failure, no HTTP response): ${lastNetworkError}`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
      continue;
    }

    if (response.ok) {
      const body = (await response.json()) as {
        model?: string;
        choices?: { message?: { content?: string } }[];
      };
      const content = body.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("OmniRoute returned a response with no message content.");
      }
      return { content, modelReported: body.model ?? "unknown" };
    }

    lastStatus = response.status;
    if (!RETRYABLE_STATUSES.has(response.status) || attempt === MAX_RETRIES) {
      const bodyText = await response.text().catch(() => "");
      throw new Error(`OmniRoute chat request failed: ${response.status} ${response.statusText}${bodyText ? ` — ${bodyText}` : ""}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
  }
  throw new Error(`OmniRoute chat request failed after ${MAX_RETRIES + 1} attempts (last status: ${lastStatus}).`);
}

/** Extracts a fenced code block (```typescript ... ```) from a model response by label, e.g. "TRANSLATE" or "TEST". */
function extractCodeBlock(content: string, label: string): string {
  const pattern = new RegExp(`===${label}===\\s*` + "```(?:typescript|ts)?\\s*([\\s\\S]*?)```", "i");
  const match = pattern.exec(content);
  if (!match) {
    throw new Error(
      `Could not find a "${label}" code block in OmniRoute's response. Raw response saved for inspection — ` +
        `the model may not have followed the requested output format exactly.`
    );
  }
  return match[1].trim();
}

function buildPrompt(sourceName: string, sampleJson: string): string {
  const canonicalCommon = readFileSync(path.join(CANONICAL_DIR, "common.ts"), "utf-8");
  const canonicalPatient = readFileSync(path.join(CANONICAL_DIR, "patient.schema.ts"), "utf-8");
  const canonicalEncounter = readFileSync(path.join(CANONICAL_DIR, "encounter.schema.ts"), "utf-8");
  const canonicalObservation = readFileSync(path.join(CANONICAL_DIR, "observation.schema.ts"), "utf-8");
  const canonicalMedication = readFileSync(path.join(CANONICAL_DIR, "medicationStatement.schema.ts"), "utf-8");
  const sourceAdapterInterface = readFileSync(SOURCE_ADAPTER_TYPES_PATH, "utf-8");
  const referenceTranslate = readFileSync(path.join(REFERENCE_ADAPTER_DIR, "translate.ts"), "utf-8");
  const referenceTypes = readFileSync(path.join(REFERENCE_ADAPTER_DIR, "types.ts"), "utf-8");

  return `You are drafting a first-pass TypeScript adapter for a healthcare interoperability platform. This is a DRAFT that a human developer will review and correct before it is trusted — do your best, but it is expected to need review.

## The canonical (target) schemas — Zod, TypeScript

\`\`\`typescript
// src/canonical/common.ts
${canonicalCommon}
\`\`\`

\`\`\`typescript
// src/canonical/patient.schema.ts
${canonicalPatient}
\`\`\`

\`\`\`typescript
// src/canonical/encounter.schema.ts
${canonicalEncounter}
\`\`\`

\`\`\`typescript
// src/canonical/observation.schema.ts
${canonicalObservation}
\`\`\`

\`\`\`typescript
// src/canonical/medicationStatement.schema.ts
${canonicalMedication}
\`\`\`

## The SourceAdapter interface every adapter must implement

\`\`\`typescript
// src/types/sourceAdapter.ts
${sourceAdapterInterface}
\`\`\`

## An existing adapter, as a STYLE AND STRUCTURE reference (Source C, DHIS2-style)

This shows the expected code style: a types.ts describing the source's native shape, and a translate.ts pure function doing the mapping. Follow this same structure and level of commenting (explain WHY a mapping decision was made when it's non-obvious, not what the code literally does).

\`\`\`typescript
// src/adapters/dhis2-style-c/types.ts
${referenceTypes}
\`\`\`

\`\`\`typescript
// src/adapters/dhis2-style-c/translate.ts
${referenceTranslate}
\`\`\`

## Your task

The new source is called "${sourceName}". Here is a sample of its native data (a handful of representative records, JSON):

\`\`\`json
${sampleJson}
\`\`\`

Generate:
1. A \`translate${toPascalCase(sourceName)}\` function that maps this native shape to the canonical bundle shape (matching \`CanonicalBundle\` from the SourceAdapter interface above), following the same style as the Source C reference: a pure function, explicit handling of missing/ambiguous fields (push a warning rather than guessing silently), explicit unit/date/terminology normalisation where relevant.
2. A vitest test file exercising that function against the sample data provided above, following the same style as this project's other adapter tests (construct a raw fixture object, call translate, assert on the resulting canonical shape).

Also infer and state, in a brief comment before the translate function, a plausible TypeScript \`interface\` (or set of interfaces) describing this source's native shape based on the sample data, since you don't have this source's existing types.ts to reference.

Output EXACTLY in this format, with no other text before or after:

===TRANSLATE===
\`\`\`typescript
<the full types + translate function code>
\`\`\`

===TEST===
\`\`\`typescript
<the full test file code>
\`\`\`
`;
}

function toPascalCase(kebab: string): string {
  return kebab
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function draftHeader(sourceName: string, modelReported: string): string {
  return `/**
 * ============================================================
 *  DRAFT — GENERATED BY AI (OmniRoute), NOT REVIEWED
 *  DO NOT REGISTER — do not move into src/adapters/ as-is
 * ============================================================
 *
 * Source:          ${sourceName}
 * Generated at:     ${new Date().toISOString()}
 * Generator:        scripts/generateAdapter.ts (Backend_Research.docx Section 8.1)
 * Routed to model:  ${modelReported}
 *                   (whatever OmniRoute reports for this request; its
 *                   free-tier auto-router may pick a different underlying
 *                   model on a different run — this is logged verbatim,
 *                   not normalised, per the project's honesty requirement)
 *
 * This file must be manually reviewed, corrected, and tested by a
 * developer before any part of it is trusted. See
 * src/adapters/_drafts/README.md for the full review workflow.
 * ============================================================
 */

`;
}

async function main() {
  const { source, sample } = parseArgs(process.argv.slice(2));

  console.log(`Checking OmniRoute is reachable at ${OMNIROUTE_URL} ...`);
  await checkOmniRouteReachable();
  console.log("OmniRoute is reachable. Generating draft adapter...");

  const sampleJson = readFileSync(sample, "utf-8");
  // Validate it's actually JSON before spending a request on it.
  JSON.parse(sampleJson);

  const prompt = buildPrompt(source, sampleJson);
  const { content, modelReported } = await callOmniRoute(prompt);

  console.log(`OmniRoute routed this request to: ${modelReported}`);

  const outDir = path.join(DRAFTS_DIR, source);
  mkdirSync(outDir, { recursive: true });

  const header = draftHeader(source, modelReported);

  let translateCode: string;
  let testCode: string;
  try {
    translateCode = extractCodeBlock(content, "TRANSLATE");
    testCode = extractCodeBlock(content, "TEST");
  } catch (err) {
    // Save the raw response even on a parse failure so nothing is lost —
    // a human can still extract something useful from it manually.
    const rawPath = path.join(outDir, "raw-response.txt");
    writeFileSync(rawPath, content, "utf-8");
    console.error(`${(err as Error).message}\nRaw response saved to: ${rawPath}`);
    process.exitCode = 1;
    return;
  }

  const translatePath = path.join(outDir, "translate.draft.ts");
  const testPath = path.join(outDir, "translate.draft.test.ts");

  writeFileSync(translatePath, header + translateCode + "\n", "utf-8");
  writeFileSync(testPath, header + testCode + "\n", "utf-8");

  console.log(`\nDraft written:\n  ${translatePath}\n  ${testPath}`);
  console.log(`\nNEXT STEP (mandatory): review both files by hand before trusting anything in them.`);
  console.log(`See src/adapters/_drafts/README.md for the review workflow.`);
}

main().catch((err) => {
  console.error(`\nError: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
