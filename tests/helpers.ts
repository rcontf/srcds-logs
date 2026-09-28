import { createSocket, type Socket } from "node:dgram";

export function bindSocket(port: number, address = "127.0.0.1"): Promise<Socket> {
  const socket = createSocket("udp4");

  return new Promise((resolve, reject) => {
    socket.once("error", reject);

    socket.bind(port, address, () => {
      socket.off("error", reject);
      resolve(socket);
    });
  });
}

export const createFakeServer = async () => await bindSocket(0);

export function buildPacket(message: string): Uint8Array {
  const encoder = new TextEncoder();
  const body = `L ${message}`;
  return new Uint8Array([0xff, 0xff, 0xff, 0xff, 0x52, ...encoder.encode(body), 0x00, 0x00]);
}
