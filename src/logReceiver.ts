import { Buffer } from "node:buffer";
import { EventEmitter } from "events";
import { type Socket, createSocket, type RemoteInfo } from "node:dgram";
import { parsePacket } from "./parser";

export interface LogReceiverOptions {
  port?: number;
  address?: string;
}

export class LogReceiver extends EventEmitter {
  #socket: Socket;

  constructor(
    { address, port }: LogReceiverOptions = { address: "0.0.0.0", port: 9871 }
  ) {
    super();
    this.#socket = createSocket("udp4", this.#handleMessage.bind(this));
    this.#socket.bind(port, address);
  }

  #handleMessage(buffer: Buffer, serverInfo: RemoteInfo) {
    const response = parsePacket(buffer, serverInfo);

    if (response == null) {
      return;
    }

    this.emit("event", response);
  }
}
