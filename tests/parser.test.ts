import { assertEquals } from "@std/assert";
import { parsePacket } from "../src/parser.ts";

Deno.test("Invalid packets return null", () => {
  const packet = "bogus";
  const encoded = new TextEncoder().encode(packet);

  const result = parsePacket(encoded);

  assertEquals(result, null);
});

Deno.test("Null when no payload present", () => {
  const packet = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0x52]);

  const result = parsePacket(packet);

  assertEquals(result, null);
});

Deno.test("Header not equal", () => {
  const packet = new Uint8Array([0xEE, 0xEE, 0xEE, 0xEE, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]);

  const result = parsePacket(packet);

  assertEquals(result, null);
});

Deno.test("Log header not present", () => {
  const encoder = new TextEncoder();
  const body = "01/01/2000 rcon from 0.0.0.0";
  const packet = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0x52, ...encoder.encode(body)]);

  const result = parsePacket(packet);

  assertEquals(result, null);
});

Deno.test("Can deserialize a valid packet", () => {
  const encoder = new TextEncoder();
  const body = "L 01/01/2000 rcon from 0.0.0.0";
  const packet = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0x52, ...encoder.encode(body)]);

  const result = parsePacket(packet);

  assertEquals(result?.message, body.substring(2));
  assertEquals(result?.password, null);
});

Deno.test("Can parse a password", () => {
  const encoder = new TextEncoder();
  const password = "secret";
  const body = "L 01/01/2000 rcon from 0.0.0.0";
  const packet = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0x53, ...encoder.encode(password), ...encoder.encode(body)]);

  const result = parsePacket(packet);

  assertEquals(result?.message, body.substring(2));
  assertEquals(result?.password, password);
});
