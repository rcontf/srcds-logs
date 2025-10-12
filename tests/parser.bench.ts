import { assertEquals } from "@std/assert";
import { parsePacket } from "../src/parser.ts";

Deno.bench("Can deserialize a valid packet", { baseline: true, group: "no-password" }, () => {
  const encoder = new TextEncoder();
  const body = "L 01/01/2000 rcon from 0.0.0.0";
  const packet = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0x52, ...encoder.encode(body), 0x00, 0x00]);

  const result = parsePacket(packet);

  assertEquals(result?.message, body.substring(2));
  assertEquals(result?.password, null);
});

Deno.bench("Can parse a password", { baseline: true, group: "password" }, () => {
  const encoder = new TextEncoder();
  const password = "secret";
  const body = "L 01/01/2000 rcon from 0.0.0.0";
  const packet = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0x53, ...encoder.encode(password), ...encoder.encode(body), 0x00, 0x00]);

  const result = parsePacket(packet);

  assertEquals(result?.message, body.substring(2));
  assertEquals(result?.password, password);
});