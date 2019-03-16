import Command from "../../processing/commands/Command";
import { name, description, group, format } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";
import i18next from "i18next";
import User from "../../models/User";

import { defaults } from "../../../config";

@name("user")
@group("locale")
@description(ls`commands:locale.user.description`)
@format(ls`commands:locale.user.format`)
export default class UserLocaleCommand extends Command {
    async run(message, [value]) {
        const [user] = await User.findOrBuild({
            where: { id: message.author.id },
            defaults: { id: message.author.id, locale: defaults.locale }
        });

        if (!value) {
            return ll`commands:locale.user.messages.get`({ locale: user.locale });
        }

        if (value == user.locale) {
            return ll`commands:locale.user.messages.sameLocale`();
        }

        if (!i18next.languages.includes(value)) {
            return ll`commands:locale.user.messages.invalidLocale`({ locale: value });
        }

        const oldLocale = user.locale;

        user.locale = value;

        await user.save();

        return ll`commands:locale.user.messages.set`({ from: oldLocale, to: value });
    }
}