import { describe, expect, it, beforeAll, afterAll } from "vitest";
import Fastify, { type FastifyInstance } from "fastify";
import rateLimit from "@fastify/rate-limit";
import httpProxy from "@fastify/http-proxy";

/**
 * Step 2 verification: the gateway's rate limiting triggers correctly under
 * repeated rapid requests, and normal (within-limit) requests pass through
 * unaffected. Built as a self-contained gateway+stub-upstream pair rather
 * than depending on the real backend/Postgres/source APIs being up, so this
 * test can run in isolation and exercises exactly the same
 * @fastify/rate-limit + @fastify/http-proxy configuration as
 * src/api/gateway.ts.
 */
describe("gateway rate limiting", () => {
  let upstream: FastifyInstance;
  let gateway: FastifyInstance;
  let upstreamPort: number;
  let gatewayPort: number;

  beforeAll(async () => {
    upstream = Fastify();
    upstream.get("/ping", async () => ({ ok: true }));
    await upstream.listen({ port: 0, host: "127.0.0.1" });
    upstreamPort = (upstream.server.address() as { port: number }).port;

    gateway = Fastify();
    await gateway.register(rateLimit, { max: 5, timeWindow: "1 minute" });
    await gateway.register(httpProxy, {
      upstream: `http://127.0.0.1:${upstreamPort}`,
      prefix: "/",
      rewritePrefix: "/",
    });
    await gateway.listen({ port: 0, host: "127.0.0.1" });
    gatewayPort = (gateway.server.address() as { port: number }).port;
  });

  afterAll(async () => {
    await gateway.close();
    await upstream.close();
  });

  // Both tests share one gateway instance (and therefore one rate-limit
  // window per client IP) since standing up a fresh gateway/upstream pair
  // per test would be needless overhead here — so together they must not
  // exceed the configured max (5) requests, and each test accounts for the
  // requests the other one makes.

  it("passes a normal request through to the upstream unaffected", async () => {
    const response = await fetch(`http://127.0.0.1:${gatewayPort}/ping`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it("triggers 429 once the rate limit is exceeded, without ever hurting requests under the limit", async () => {
    // One request already succeeded in the previous test against this same
    // gateway instance/IP, so 4 more requests stay within the max-5 budget.
    const results: number[] = [];
    for (let i = 0; i < 8; i++) {
      const response = await fetch(`http://127.0.0.1:${gatewayPort}/ping`);
      results.push(response.status);
    }

    const successCount = results.filter((s) => s === 200).length;
    const limitedCount = results.filter((s) => s === 429).length;

    expect(successCount).toBe(4); // remaining budget after the prior test's 1 request
    expect(limitedCount).toBe(4);
    expect(successCount + limitedCount).toBe(results.length);
    expect(results.slice(0, 4)).toEqual([200, 200, 200, 200]);
    expect(results.slice(4)).toEqual([429, 429, 429, 429]);
  });
});
