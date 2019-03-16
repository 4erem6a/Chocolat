import Command from "../../processing/commands/Command";
import { name, description } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";

@name("info")
@description(ls`commands:info.description`)
export default class InfoCommand extends Command {
    run(message) {
        message.channel.send(ll`commands:info.messages.info`());
    }
}