import { type RemoteInfo } from "node:dgram";

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

export interface EventData extends ParsedLogMessage {
  /**
   * The remote address information that sent the packet
   */
  socket: RemoteInfo;
}
