import assert from "node:assert/strict";
import test from "node:test";
import { blogDraftErrorMessage, blogDraftErrorStatus } from "../lib/blog-draft-error.mjs";

test("draft API preserves a structured backend error message instead of returning [object Object]", () => {
  const message = blogDraftErrorMessage({ message: "This article changed in another session. Reload it before saving again.", code: "PGRST116" });
  assert.equal(message, "This article changed in another session. Reload it before saving again.");
  assert.equal(blogDraftErrorStatus(message), 409);
});

test("draft API never serializes an unknown error object as [object Object]", () => {
  const message = blogDraftErrorMessage({ details: "private database detail" });
  assert.equal(message, "Draft save failed. Please retry.");
  assert.notEqual(message, "[object Object]");
  assert.equal(blogDraftErrorStatus(message), 400);
});
