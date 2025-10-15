import { LogReceiver } from "../src/index.ts";

const controller = new AbortController();
const { signal } = controller;

const receiver = new LogReceiver({
  address: "0.0.0.0",
  port: 9871,
  signal,
});

console.log("Log receiver running");

// timeout after 5 seconds
setTimeout(() => {
  console.log("Aborting");
  controller.abort();
}, 5000);

for await (const data of receiver) {
  console.log(data);
}
