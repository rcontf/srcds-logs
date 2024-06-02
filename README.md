# srcds-logs

Wrapper around [Source Dedicated Server](https://developer.valvesoftware.com/wiki/Source_Dedicated_Server) UDP log streams for node.

## Set Up

Your server must have logs enabled. To do so, run `log on` in your server console or through RCON. In order to receieve messages, you must also add a log address using `logaddress_add` command to add the URL or IP of your server's receiver. To delete a destination, use `logaddress_del`.

You can always list existing addresses using `logaddress_list`.

## Installation

See https://jsr.io/@c43721/srcds-log-receiver for more details.

### Usage

You can define a receiver and listen to messages published to the UDP stream.

```ts
import { LogReceiver } from "@c43721/srcds-log-receiver";

const receiver = new LogReceiver({
  address: "0.0.0.0",
  port: 9871,
});

console.log("Log receiver running.. ");

receiver.on("event", (message) => console.log(message));
```

### Security

In order to make this as extendable as possible, there is no built in security. However, you can mitigate this by using `sv_logsecret` and checking for the password in the packet. Otherwise, you can use the Socket information to determine what IPs sent the message.

### Examples

For more examples, see documentation or the examples folder.

## Contributing

If there's a feature or bug, please raise a github issue first alongside your PR (if you're kind enough to make a PR.)

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
