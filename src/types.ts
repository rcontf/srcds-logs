import type { RemoteInfo } from "node:dgram";

/**
 * Represents the parsed information from the message data
 */
export interface ParsedLogMessage {
  /**
   * The password sent by the server, if present
   */
  password: string | null;

  /**
   * The message contained in the data
   */
  message: string;
}

/**
 * The parsed log data
 */
export interface EventData extends ParsedLogMessage {
  /**
   * The remote address information that sent the packet
   */
  socket: RemoteInfo;
}

/**
 * The socket options for the UDP socket
 */
export interface LogReceiverOptions {
  /**
   * The address to listen on
   *
   * @default "0.0.0.0"
   */
  address?: string;

  /**
   * The port to use
   *
   * @default 9871
   */
  port?: number;

  /**
   * The abort signal to use
   *
   * When calling {@linkcode AbortSignal.abort}, it will automatically close the underlying socket
   */
  signal?: AbortSignal;
}
