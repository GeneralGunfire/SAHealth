import { describe, expect, it } from "vitest";
import { withTransientRetry } from "../../src/adapters/retry.js";
import { connectionRefusedError, timeoutError, authFailureError } from "../fixtures/failingAdapter.js";
import { classifySourceFailure } from "../../src/core/sourceFailureReason.js";

/**
 * Step 2: transient-failure retry in the adapter layer.
 *
 * The contract being pinned down here is deliberately narrow: a transient
 * blip is retried and can silently recover, while everything about how a
 * *final* failure is classified and disclosed stays exactly as it was. A
 * retry must never convert a failure into a different kind of failure, nor
 * turn a deterministic rejection (auth) into three rejected requests.
 *
 * Backoff delays are injected so these tests don't spend the real ~1s.
 */
const FAST_BACKOFF = [1, 1] as const;

describe("adapter transient-failure retry", () => {
  it("(a) recovers when a source fails once then succeeds: the caller sees a normal success", async () => {
    let attempts = 0;
    const result = await withTransientRetry(
      "clinic-a",
      async () => {
        attempts++;
        if (attempts === 1) throw connectionRefusedError();
        return { patient: "ok" };
      },
      FAST_BACKOFF
    );

    // The transient failure is invisible to the caller — no error surfaces,
    // so the orchestrator never records this source as failed.
    expect(result).toEqual({ patient: "ok" });
    expect(attempts).toBe(2);
  });

  it("(a2) recovers from a timeout too, on the last allowed attempt", async () => {
    let attempts = 0;
    const result = await withTransientRetry(
      "dhis2-style-c",
      async () => {
        attempts++;
        if (attempts < 3) throw timeoutError();
        return { patient: "ok" };
      },
      FAST_BACKOFF
    );

    expect(result).toEqual({ patient: "ok" });
    expect(attempts).toBe(3); // 1 initial + 2 retries, all used
  });

  it("(b) a consistently failing source still fails, with the SAME error and classification — just after 3 attempts", async () => {
    let attempts = 0;
    const thrown = connectionRefusedError();

    await expect(
      withTransientRetry(
        "hospital-b",
        async () => {
          attempts++;
          throw thrown;
        },
        FAST_BACKOFF
      )
    ).rejects.toBe(thrown); // the original error object, not a wrapped one

    expect(attempts).toBe(3);
    // Failure isolation downstream classifies exactly as before.
    expect(classifySourceFailure(thrown)).toBe("connection-refused");
  });

  it("(c) an auth failure is NOT retried: it fails immediately, after exactly one attempt", async () => {
    let attempts = 0;
    const thrown = authFailureError("Clinic A source");

    await expect(
      withTransientRetry(
        "clinic-a",
        async () => {
          attempts++;
          throw thrown;
        },
        FAST_BACKOFF
      )
    ).rejects.toBe(thrown);

    expect(attempts).toBe(1);
    expect(classifySourceFailure(thrown)).toBe("auth-failure");
  });

  it("(c2) an invalid response is not retried either — a deterministic 'no' from the source", async () => {
    let attempts = 0;
    const thrown = new Error("Hospital B source API returned 500 Internal Server Error");

    await expect(
      withTransientRetry("hospital-b", async () => {
        attempts++;
        throw thrown;
      }, FAST_BACKOFF)
    ).rejects.toBe(thrown);

    expect(attempts).toBe(1);
    expect(classifySourceFailure(thrown)).toBe("invalid-response");
  });

  it("does not retry a successful call, and returns its value untouched", async () => {
    let attempts = 0;
    const result = await withTransientRetry(
      "pharmacy-e",
      async () => {
        attempts++;
        return null; // a source legitimately having no record for this id
      },
      FAST_BACKOFF
    );

    expect(result).toBeNull();
    expect(attempts).toBe(1);
  });
});
