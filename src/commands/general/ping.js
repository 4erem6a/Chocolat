import Command from "../../processing/commands/Command";
import { name, description } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";

@name("ping")
@description(ls`commands:general.ping.description`)
export default class PingCommand extends Command {
    async run(message) {
        const pingMessage = await message.channel.send(ll`commands:general.ping.messages.pinging`());
        const latency = pingMessage.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(this.client.ping);
        pingMessage.edit(ll`commands:general.ping.messages.result`({ latency, apiLatency }));
    }
}