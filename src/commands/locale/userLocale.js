import Command from "../../processing/commands/Command";
import { name, description, group, format } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";
import i18next from "i18next";
import UserLocale from "../../models/UserLocale";

import { defaults } from "../../../config";

@name("locale:user")
@group("locale")
@description(ls`commands:userLocale.description`)
@format(ls`commands:userLocale.format`)
export default class UserLocaleCommand extends Command {
    async run(message, [value]) {
        const [userLocale] = await UserLocale.findOrBuild({
            where: { id: message.author.id },
            defaults: { id: message.author.id, locale: defaults.locale }
        });

        if (!value) {
            return ll`commands:userLocale.messages.get`({ locale: userLocale.locale });
        }

        if (value == userLocale.locale) {
            return ll`commands:userLocale.messages.sameLocale`();
        }

        if (!i18next.languages.includes(value)) {
            return ll`commands:userLocale.messages.invalidLocale`({ locale: value });
        }

        const oldLocale = userLocale.locale;

        userLocale.locale = value;

        await userLocale.save();

        return ll`commands:userLocale.messages.set`({ from: oldLocale, to: value });
    }
}