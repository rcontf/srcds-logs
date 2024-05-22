import { Buffer } from "node:buffer";
import { EventEmitter } from "events";
import { type Socket, createSocket, type RemoteInfo } from "node:dgram";
import { parsePacket } from "./parser";

/**
 * The socket options for the UDP socket
 */
export interface LogReceiverOptions {
  /**
   * The IP address to bind to
   */
  address?: string;

  /**
   * The port to use
   */
  port?: number;
}

/**
 * An event emitter that will emit a message event when a valid UDP log is created on the server
 * 
 * ```ts
import { LogReceiver } from "srcds";

const receiver = new LogReceiver({
  address: "0.0.0.0",
  port: 9871,
});

receiver.on("event", (message) => console.log(message));
```
 */
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
