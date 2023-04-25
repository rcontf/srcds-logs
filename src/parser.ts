import { Buffer } from "node:buffer";
import type { RemoteInfo } from "node:dgram";

const packetHeader = Buffer.from([255, 255, 255, 255]);
const logMessageEndChar = "L ";

const passwordFlag = Buffer.from([0x53]);

export function parsePacket(message: Buffer, serverInfo: RemoteInfo) {
  if (message.length < 16) {
    return;
  }

  const srcdsHeader = message.subarray(0, 4);

  if (srcdsHeader.compare(packetHeader) !== 0) {
    return;
  }

  let logMessageStart = message.indexOf(logMessageEndChar, undefined, "ascii");

  if (logMessageStart === -1) {
    return;
  }

  const packetTypeSlice = message.subarray(4, 5);
  const packetType = packetTypeSlice.compare(passwordFlag);

  let password = null;
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
