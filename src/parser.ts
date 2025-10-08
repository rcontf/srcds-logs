import { logMessageEndChar, packetHeader, passwordFlag } from "./constants.ts";
import type { ParsedLogMessage } from "./types.ts";
import { equals, indexOfNeedle } from "@std/bytes";

const DECODER = new TextDecoder();

/**
 * Parses and validates the incoming buffer
 * @private
 *
 * @param message The message from the socket
 * @returns An object that contains the log message, the password used, and the socket information or null if no message was parsed
 */
export function parsePacket(message: Uint8Array): ParsedLogMessage | null {
  if (message.length < 16) {
    return null;
  }

  const srcdsHeader = message.subarray(0, 4);

  if (!equals(srcdsHeader, packetHeader)) {
    return null;
  }

  let logMessageStart = indexOfNeedle(message, logMessageEndChar, 4);

  if (logMessageStart === -1) {
    return null;
  }

  let password: Uint8Array | null = null;
  if (message[4] === passwordFlag) {
    // The packet sent us a password, let's fetch that out
    password = message.subarray(5, logMessageStart);
  }

  logMessageStart += logMessageEndChar.length;

  const fullLogMessage = message.subarray(logMessageStart, message.length);

  return {
    password: password ? DECODER.decode(password) : null,
    message: DECODER.decode(fullLogMessage),
  };
}
