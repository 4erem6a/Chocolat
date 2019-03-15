import CommandParser from "./CommandParser";
import Guild from "../../models/Guild";
import UserLocale from "../../models/UserLocale";

import { defaults } from "../../../config";
import i18next from "i18next";

export default async function handleCommand(message) {
    if (message.author.bot || message.system) {
        return;
    }

    const [prefix, locale] = await loadData(message);
    
    const mentionPrefixPattern = new RegExp(`^\\s*<@!?${message.client.user.id}>\\s*`);

    const startsWithPrefix = message.content.toLowerCase().startsWith(prefix.toLowerCase());
    const startsWithMention = mentionPrefixPattern.test(message.content);

    if (!startsWithPrefix && !startsWithMention) {
        return;
    }

    const rawCommand = message.content.substring(
        startsWithPrefix
            ? prefix.length
            : message.content.match(mentionPrefixPattern)[0].length
    ).trim();

    if (rawCommand.length == 0) {
        return;
    }

    const parser = new CommandParser(rawCommand);

    const [ commandOrGroup, maybeCommand ] = parser.part().split("::", 2);

    const command = message.client.commands.get(commandOrGroup, maybeCommand);

    if (!command) {
        return;
    }

    await i18next.changeLanguage(locale).catch(console.error);

    command.locale = locale;

    command.invoke(message.client, message, parser.rest());
}

async function loadData(message) {
    const userLocale = await UserLocale.findByPk(message.author.id);

    if (!message.guild) {
        return [
            defaults.prefix,
            userLocale && userLocale.locale || defaults.locale
        ];
    }

    const guild = await Guild.findByPk(message.guild.id);

    const prefix = guild && guild.prefix || defaults.prefix;
    const locale = userLocale && userLocale.overrideGuildLocale
        ? userLocale.locale || defaults.locale
        : guild && guild.locale || userLocale.locale || defaults.locale;

    return [prefix, locale];
}