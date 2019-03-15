import Command from "../../processing/commands/Command";
import { name, description } from "../../processing/commands/decorators";
import { ls } from "../../utils/LocalizedString";
import i18next from "i18next";
import UserLocale from "../../models/UserLocale";

import { defaults } from "../../../config";

@name("locale:user")
@description(ls`commands:userLocale.description`)
export default class PingCommand extends Command {
    async run(message, [value]) {
        const [userLocale] = await UserLocale.findOrBuild({
            where: { id: message.author.id },
            defaults: { id: message.author.id, locale: defaults.locale }
        });

        if (!value) {
            return i18next.t("commands:userLocale.messages.get", { locale: userLocale.locale });
        }

        if (value == userLocale.locale) {
            return i18next.t("commands:userLocale.messages.sameLocale");
        }

        if (!i18next.languages.includes(value)) {
            return i18next.t("commands:userLocale.messages.invalidLocale", { locale: value });
        }

        const oldLocale = userLocale.locale;

        userLocale.locale = value;

        await userLocale.save();

        return i18next.t("commands:userLocale.messages.set", { from: oldLocale, to: value });
    }
}