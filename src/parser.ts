import { Buffer } from "node:buffer";
import type { RemoteInfo } from "node:dgram";

const packetHeader = Buffer.from([255, 255, 255, 255]);
const logMessageEndChar = "L ";

const passwordByte = 0x53;
const missingPasswordByte = 0x52;

export function parsePacket(message: Buffer, serverInfo: RemoteInfo) {
  if (message.length < 16) {
    return;
  }

  if (message.subarray(0, 4).compare(packetHeader) !== 0) {
    return;
  }

  let logMessageStart = message.indexOf(logMessageEndChar);

  if (logMessageStart === -1) {
    return;
  }

  logMessageStart += logMessageEndChar.length;

  const fullLogMessage = message
    .subarray(logMessageStart, message.length - 2)
    .toString();

  return {
    message: fullLogMessage,
    socket: {
      ip: serverInfo.address,
      port: serverInfo.port,
    },
  };
}
