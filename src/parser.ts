import { Buffer } from "node:buffer";
import type { RemoteInfo } from "node:dgram";
import { logMessageEndChar, packetHeader, passwordFlag } from "./constants";
import { ParsedLogMessage } from "./types";

/**
 * Parses and validates the incoming buffer
 * @param message The message from the socket
 * @param serverInfo The socket information of the connecting resource
 * @returns An object that contains the log message, the password used, and the socket information or null if no message was parsed
 */
export function parsePacket(
  message: Buffer,
  serverInfo: RemoteInfo
): ParsedLogMessage | null {
  if (message.length < 16) {
    return null;
  }

  const srcdsHeader = message.subarray(0, 4);

  if (srcdsHeader.compare(packetHeader) !== 0) {
    return null;
  }

  let logMessageStart = message.indexOf(logMessageEndChar, undefined, "ascii");

  if (logMessageStart === -1) {
    return null;
  }

  const packetTypeSlice = message.subarray(4, 5);
  const packetType = packetTypeSlice.compare(passwordFlag);

  let password: string | null = null;
  if (packetType === 0) {
    // The packet sent us a password, let's fetch that out
    password = message.subarray(5, logMessageStart).toString("ascii");
  }

  logMessageStart += logMessageEndChar.length;

  const fullLogMessage = message
    .subarray(logMessageStart, message.length - 2)
    .toString("ascii");

  return {
    password,
    message: fullLogMessage,
    socket: {
      ip: serverInfo.address,
      port: serverInfo.port,
    },
  };
}
