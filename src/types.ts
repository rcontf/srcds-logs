/**
 * Object holding the parsed information from the UDP log
 */
export interface ParsedLogMessage {
  /**
   * The password sent by the server
   */
  password: string | null;

  /**
   * The log the server sent
   */
  message: string;

  /**
   * The socket information of the server
   */
  socket: {
    /**
     * The source IP of the message
     */
    ip: string;

    /**
     * The port of the server
     */
    port: number;
  };
}
