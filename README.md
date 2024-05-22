# srcds-logs

Wrapper around srcds udp log streams for node

# Usage

You can define a receiver and listen to messages published to the UDP stream

```ts
import { LogReceiver } from "srcds";

const receiver = new LogReceiver({
  address: "0.0.0.0",
  port: 9871,
});

console.log("Log receiver running.. ");

receiver.on("event", (message) => console.log(message));
```

In order to check for passwords (in cases where it's important to not have people publish unwanted packets to your server) you can check the password property on the object.

```ts
import { LogReceiver } from "srcds";

const receiver = new LogReceiver({
  address: "0.0.0.0",
  port: 9871,
});

console.log("Log receiver running.. ");

receiver.on("event", (message) => {
  if (message.password === "mysupersecretpassword") {
    // do something awesome
  }
});
```

# Contributing
If there's a feature or bug, please raise a github issue first alongside your PR (if you're kind enough to make a PR)
