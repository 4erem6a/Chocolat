import Command from "../../processing/commands/Command";
import { name, description, format } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";
import Guild from "../../models/Guild";

import { defaults } from "../../../config";

@name("prefix")
@description(ls`commands:general.prefix.description`)
@format(ls`commands:general.prefix.format`)
export default class PrefixCommand extends Command {
    hasPermissions(userOrMember) {
        return userOrMember.user
            ? userOrMember.hasPermission("MANAGE_GUILD")
                || ll`messages:errors.missingPermissions`()
            : true;
    }

    async run(message, [prefix]) {
        if (!message.guild) {
            return ll`commands:general.prefix.messages.dmPrefix`({ prefix: defaults.prefix });
        }

        const [guild] = await Guild.findOrBuild({
            where: { id: this.guild.id },
            defaults: { id: this.guild.id, prefix: defaults.prefix }
        });

        if (!prefix) {
            return ll`commands:general.prefix.messages.get`({ prefix: guild.prefix });
        }

        const maxLength = 255;

        if (prefix.length >= maxLength) {
            return ll`commands:general.prefix.messages.tooLong`({ maxLength: maxLength });
        }

        const oldPrefix = guild.prefix;

        guild.prefix = prefix;

        await guild.save();

        return ll`commands:general.prefix.messages.set`({ from: oldPrefix, to: prefix });
    }
}