import Command from "../../processing/commands/Command";
import { name, description, format } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";
import Guild from "../../models/Guild";

import { defaults } from "../../../config";

@name("prefix")
@description(ls`commands:prefix.description`)
@format(ls`commands:prefix.format`)
export default class PingCommand extends Command {
    hasPermissions(userOrMember) {
        return userOrMember.user
            ? userOrMember.hasPermission("MANAGE_GUILD")
                || ll`messages:errors.missingPermissions`()
            : true;
    }

    async run(message, [prefix]) {
        if (!message.guild) {
            return ll`commands:prefix.messages.dmPrefix`({ prefix: defaults.prefix });
        }

        const [guild] = await Guild.findOrBuild({
            where: { id: this.guild.id },
            defaults: { id: this.guild.id, prefix: defaults.prefix }
        });

        if (!prefix) {
            return ll`commands:prefix.messages.get`({ prefix: guild.prefix });
        }

        const oldPrefix = guild.prefix;

        guild.prefix = prefix;

        await guild.save();

        return ll`commands:prefix.messages.set`({ from: oldPrefix, to: prefix });
    }
}