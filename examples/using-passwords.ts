import { LogReceiver } from "../src/index.ts";

const receiver = new LogReceiver({
  address: "0.0.0.0",
  port: 9871,
});

console.log("Log receiver running");

for await (const data of receiver) {
  if (data.password === null) {
    console.log("Bad password");
  } else if (data.password === "mysuperdupersecret") {
    console.log(data);
  }
}
