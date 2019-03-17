import Command from "../../processing/commands/Command";
import { name, description, group, guildOnly, format } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";
import i18next from "i18next";
import Guild from "../../models/Guild";

import { defaults } from "../../../config";

@name("guild")
@group("locale")
@description(ls`commands:locale.guild.description`)
@format(ls`commands:locale.guild.format`)
@guildOnly
export default class GuildLocaleCommand extends Command {
    hasPermissions(member) {
        return member.hasPermission("MANAGE_GUILD")
            || ll`messages:errors.missingPermissions`();
    }

    async run(message, [value]) {
        const [guild] = await Guild.findOrBuild({
            where: { id: message.guild.id },
            defaults: { id: message.guild.id, locale: defaults.locale }
        });

        if (!value) {
            return ll`commands:locale.guild.messages.get`({ locale: guild.locale });
        }

        if (value == guild.locale) {
            return ll`commands:locale.guild.messages.sameLocale`();
        }

        if (!i18next.languages.includes(value)) {
            return ll`commands:locale.guild.messages.invalidLocale`({ locale: value });
        }

        const oldLocale = guild.locale;

        guild.locale = value;

        await guild.save();

        return ll`commands:locale.guild.messages.set`({ from: oldLocale, to: value });
    }
}