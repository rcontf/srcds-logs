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

type EventMap = {
  [key: string]: (...args: any[]) => void;
};

/**
 * Copied from https://github.com/andywer/typed-emitter/blob/master/index.d.ts
 * Type-safe event emitter
 *
 * Use it like this:
 *
 * ```ts
 * type MyEvents = {
 *   error: (error: Error) => void;
 *   message: (from: string, content: string) => void;
 * }
 *
 * const myEmitter = new EventEmitter() as TypedEmitter<MyEvents>;
 *
 * myEmitter.emit("error", "x")  // <- Will catch this type error;
 * ```
 */
export interface TypedEventEmitter<Events extends EventMap> {
  addListener<E extends keyof Events>(event: E, listener: Events[E]): this;
  on<E extends keyof Events>(event: E, listener: Events[E]): this;
  once<E extends keyof Events>(event: E, listener: Events[E]): this;
  prependListener<E extends keyof Events>(event: E, listener: Events[E]): this;
  prependOnceListener<E extends keyof Events>(event: E, listener: Events[E]): this;

  off<E extends keyof Events>(event: E, listener: Events[E]): this;
  removeAllListeners<E extends keyof Events>(event?: E): this;
  removeListener<E extends keyof Events>(event: E, listener: Events[E]): this;

  emit<E extends keyof Events>(event: E, ...args: Parameters<Events[E]>): boolean;
  // The sloppy `eventNames()` return type is to mitigate type incompatibilities - see #5
  eventNames(): (keyof Events | string | symbol)[];
  rawListeners<E extends keyof Events>(event: E): Events[E][];
  listeners<E extends keyof Events>(event: E): Events[E][];
  listenerCount<E extends keyof Events>(event: E): number;

  getMaxListeners(): number;
  setMaxListeners(maxListeners: number): this;
}
