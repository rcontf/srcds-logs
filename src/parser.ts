import type { Buffer } from "node:buffer";
import { logMessageEndChar, packetHeader, passwordFlag } from "./constants.ts";
import type { ParsedLogMessage } from "./types.ts";

/**
 * Parses and validates the incoming buffer
 * @private
 * @param message The message from the socket
 * @returns An object that contains the log message, the password used, and the socket information or null if no message was parsed
 */
export function parsePacket(message: Buffer): ParsedLogMessage | null {
  if (message.length < 16) {
    return null;
  }

  const srcdsHeader = message.subarray(0, 4);

  if (srcdsHeader.compare(new Uint8Array(packetHeader)) !== 0) {
    return null;
  }

  let logMessageStart = message.indexOf(logMessageEndChar, undefined, "utf-8");

  if (logMessageStart === -1) {
    return null;
  }

  const packetTypeSlice = message.subarray(4, 5);
  const packetType = packetTypeSlice.compare(new Uint8Array(passwordFlag));

  let password: string | null = null;
  if (packetType === 0) {
    // The packet sent us a password, let's fetch that out
    password = message.subarray(5, logMessageStart).toString("utf-8");
  }

  logMessageStart += logMessageEndChar.length;

  const fullLogMessage = message
    .subarray(logMessageStart, message.length - 2)
    .toString("utf-8");

  return {
    password,
    message: fullLogMessage,
  };
}
