import { Buffer } from "node:buffer";

export const packetHeader = Buffer.from([255, 255, 255, 255]);
export const logMessageEndChar = "L ";
export const passwordFlag = Buffer.from([0x53]);
