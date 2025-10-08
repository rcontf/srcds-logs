import { Buffer } from "node:buffer";
import assert from "node:assert";
import { parsePacket } from "../src/parser.ts";

Deno.test("Invalid packets return null", () => {
  const packet = "bogus";
  const encoded = new TextEncoder().encode(packet);

  const result = parsePacket(Buffer.from(encoded));

  assert.equal(result, null);
});
