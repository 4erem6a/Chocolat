import Command from "../../processing/commands/Command";
import { name, description, group, format } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";
import i18next from "i18next";
import User from "../../models/User";

import { defaults } from "../../../config";

@name("locale:user")
@group("locale")
@description(ls`commands:userLocale.description`)
@format(ls`commands:userLocale.format`)
export default class UserLocaleCommand extends Command {
    async run(message, [value]) {
        const [user] = await User.findOrBuild({
            where: { id: message.author.id },
            defaults: { id: message.author.id, locale: defaults.locale }
        });

        if (!value) {
            return ll`commands:userLocale.messages.get`({ locale: user.locale });
        }

        if (value == user.locale) {
            return ll`commands:userLocale.messages.sameLocale`();
        }

        if (!i18next.languages.includes(value)) {
            return ll`commands:userLocale.messages.invalidLocale`({ locale: value });
        }

        const oldLocale = user.locale;

        user.locale = value;

        await user.save();

        return ll`commands:userLocale.messages.set`({ from: oldLocale, to: value });
    }
}