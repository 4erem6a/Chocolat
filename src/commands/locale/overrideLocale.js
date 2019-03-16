import Command from "../../processing/commands/Command";
import { name, description, group, format } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";
import User from "../../models/User";

import { defaults } from "../../../config";

@name("locale:override")
@group("locale")
@description(ls`commands:overrideLocale.description`)
@format(ls`commands:overrideLocale.format`)
export default class OverrideLocaleCommand extends Command {
    async run(message, [value]) {
        const rawValue = value;
        value = value == "true" || (value == "false"
            ? false
            : value == undefined
                ? undefined
                : null
        );

        const [user] = await User.findOrBuild({
            where: { id: message.author.id },
            defaults: { id: message.author.id, locale: defaults.locale }
        });

        if (value === undefined) {
            return ll`commands:overrideLocale.messages.get`({
                value: ll`system:${user.overrideGuildLocale ? "yes" : "no"}`()
            });
        }

        if (value === null) {
            return ll`commands:overrideLocale.messages.invalidValue`({ value: rawValue });
        }

        if (value == user.overrideGuildLocale) {
            return ll`commands:overrideLocale.messages.sameValue`();
        }

        user.overrideGuildLocale = value;

        await user.save();

        return ll`commands:overrideLocale.messages.set`({
            value: ll`system:${value ? "yes" : "no"}`()
        });
    }
}