import Command from "../../processing/commands/Command";
import { name, description, group } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";
import i18next from "i18next";

@name("locale:list")
@group("locale")
@description(ls`commands:localeList.description`)
export default class LocaleListCommand extends Command {
    run() {
        const locales = i18next.languages.map(l => `\`${l}\``).reduce((a, b) => `${a}, ${b}`);
        return ll`commands:localeList.messages.get`({ locales });
    }
}