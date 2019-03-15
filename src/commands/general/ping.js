import Command from "../../processing/commands/Command";
import { name, description } from "../../processing/commands/decorators";
import { ls } from "../../utils/LocalizedString";
import i18next from "i18next";

@name("ping")
@description(ls`commands:ping.description`)
export default class PingCommand extends Command {
    async run(message) {
        const pingMessage = await message.channel.send(i18next.t("commands:ping.messages.pinging"));
        const latency = pingMessage.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(this.client.ping);
        pingMessage.edit(i18next.t("commands:ping.messages.result", { latency, apiLatency }));
    }
}