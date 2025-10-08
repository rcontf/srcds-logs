import { LogReceiver } from "jsr:@c43721/srcds-log-receiver";

const controller = new AbortController();
const { signal } = controller;

const receiver = new LogReceiver({
  address: "0.0.0.0",
  port: 9871,
  signal,
});

console.log("Log receiver running");

for await (const data of receiver) {
  console.log(data);
}

controller.abort();
