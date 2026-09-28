import { LogReceiver } from "../src/index.ts";

const receiver = new LogReceiver({
  address: "0.0.0.0",
  port: 9871,
});

await receiver.start();

console.log("Log receiver running");

for await (const data of receiver) {
  console.log(data);
}
