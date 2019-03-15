import Command from "../../processing/commands/Command";
import { name, description, group, guildOnly } from "../../processing/commands/decorators";
import { ls } from "../../utils/LocalizedString";
import i18next from "i18next";
import Guild from "../../models/Guild";

import { defaults } from "../../../config";

@name("locale:guild")
@group("locale")
@description(ls`commands:guildLocale.description`)
@guildOnly
export default class PingCommand extends Command {
    hasPermissions(member) {
        return member.hasPermission("MANAGE_GUILD")
            || i18next.t("messages:errors.missingPermissions");
    }

    async run(message, [value]) {
        const [guild] = await Guild.findOrBuild({
            where: { id: message.guild.id },
            defaults: { id: message.guild.id, locale: defaults.locale }
        });

        if (!value) {
            return i18next.t("commands:guildLocale.messages.get", { locale: guild.locale });
        }

        if (value == guild.locale) {
            return i18next.t("commands:guildLocale.messages.sameLocale");
        }

        if (!i18next.languages.includes(value)) {
            return i18next.t("commands:guildLocale.messages.invalidLocale", { locale: value });
        }

        const oldLocale = guild.locale;

        guild.locale = value;

        await guild.save();

        return i18next.t("commands:guildLocale.messages.set", { from: oldLocale, to: value });
    }
}