import assert from "node:assert";
import { LogReceiver } from "../src/index.ts";

Deno.test("Can receive a message", { ignore: true }, async () => {
    const { promise, resolve } = Promise.withResolvers<string>();

    const receiver = new LogReceiver({
        address: "127.0.0.1",
        port: 9871,
    });

    receiver.on("event", (message) => {
        resolve(message);
    });

    const message = await promise;

    assert.ok(message);
});