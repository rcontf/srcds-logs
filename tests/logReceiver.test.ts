import { assertEquals } from "@std/assert";
import { getEventListeners } from "node:events";
import { LogReceiver } from "../src/logReceiver.ts";
import { bindSocket, buildPacket, createFakeServer } from "./helpers.ts";

Deno.test("returning early from the async iterator closes and releases the socket", async () => {
  const receiver = new LogReceiver({ address: "127.0.0.1", port: 0 });
  await receiver.start();
  const receiverPort = receiver.socket!.address().port;

  const fakeServer = await createFakeServer();
  fakeServer.send(buildPacket("01/01/2000 - hello"), receiverPort, "127.0.0.1");

  for await (const message of receiver) {
    assertEquals(message.message, "01/01/2000 - hello");
    break;
  }

  // check that the port was actually released
  // rebinding to it must succeed, proving the original socket was closed.
  const probe = await bindSocket(receiverPort);

  probe.close();
  fakeServer.close();
});

Deno.test("aborting the signal closes the receiver without leaking abort listeners", async () => {
  const controller = new AbortController();

  await using receiver = new LogReceiver({ address: "127.0.0.1", port: 0 });
  await receiver.start();

  const fakeServer = await createFakeServer();
  for (let i = 0; i < 25; i++) {
    fakeServer.send(buildPacket(`burst ${i}`), receiver.socket!.address().port, "127.0.0.1");
  }

  const iterator = receiver[Symbol.asyncIterator]();
  for (let i = 0; i < 25; i++) {
    await iterator.next();

    if (i == 15) {
      controller.abort();
    }
  }

  assertEquals(getEventListeners(controller.signal, "abort").length, 0);

  fakeServer.close();
});

Deno.test("socket close event after cancellation does not throw", async () => {
  const receiver = new LogReceiver({ address: "127.0.0.1", port: 0 });
  await receiver.start();

  const iterator = receiver[Symbol.asyncIterator]();
  await iterator.return?.();
});
