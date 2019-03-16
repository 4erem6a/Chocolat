import Command from "../../processing/commands/Command";
import { name, description, group, format } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";
import User from "../../models/User";

import { defaults } from "../../../config";

@name("override")
@group("locale")
@description(ls`commands:locale.override.description`)
@format(ls`commands:locale.override.format`)
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
            return ll`commands:locale.override.messages.get`({
                value: ll`system:${user.overrideGuildLocale ? "yes" : "no"}`()
            });
        }

        if (value === null) {
            return ll`commands:locale.override.messages.invalidValue`({ value: rawValue });
        }

        if (value == user.overrideGuildLocale) {
            return ll`commands:locale.override.messages.sameValue`();
        }

        user.overrideGuildLocale = value;

        await user.save();

        return ll`commands:locale.override.messages.set`({
            value: ll`system:${value ? "yes" : "no"}`()
        });
    }
}