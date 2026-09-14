import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // AI-generated draft adapters (src/adapters/_drafts/) are expected to
    // be unreviewed and potentially broken — that is the whole point of
    // keeping them out of the reviewed codebase. Vitest's default file
    // discovery would otherwise pick up a draft's own generated test file
    // and fail the entire suite before any developer has reviewed it.
    exclude: ["**/node_modules/**", "**/dist/**", "src/adapters/_drafts/**"],
  },
});
