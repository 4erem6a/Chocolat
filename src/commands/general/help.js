import Command from "../../processing/commands/Command";
import { name, description, format } from "../../processing/commands/decorators";
import LocalizedString, { ls, ll } from "../../utils/LocalizedString";

import { defaults, embedColor } from "../../../config";
import { RichEmbed } from "discord.js";
import CommandRegistry from "../../processing/commands/CommandRegistry";
import Guild from "../../models/Guild";

@name("help")
@description(ls`commands:help.description`)
@format(ls`commands:help.format`)
export default class HelpCommand extends Command {
    async run(message, [command]) {
        if (command) {
            return this.commandDetails(message, command);
        }

        const isGuild = message.channel.type == "text";
        const caller = isGuild ? message.member : message.author;

        const embed = new RichEmbed()
            .setTitle(ll`commands:help.embed.main.title`())
            .setFooter(ll`commands:help.embed.main.footer`({ prefix: await this.getPrefix() }))
            .setColor(embedColor);

        this.getAvailableCommands(isGuild, caller).groups.forEach(group =>
            embed.addField(group.name, group.commands.map(c => `\`${c.name}\``).reduce((a, b) => `${a}, ${b}`))
        );

        message.channel.send(embed);
    }

    async commandDetails(message, command) {
        const [commandOrGroup, maybeCommand] = command.split("::", 2);
        command = this.client.commands.get(commandOrGroup, maybeCommand);

        if (!command) {
            return ll`commands:help.messages.commandNotFound`({ command });
        }

        const description = localize(command.description);
        const format = `${await this.getPrefix()}${command.name}${command.format ? ` ${localize(command.format)}` : ""}`;
        const canUse = message.channel.type != "text" && command.guildOnly
            ? ll`commands:help.messages.guildOnly`()
            : command.hasPermissions(command.guildOnly ? message.member : message.author)
                ? ll`system:yes`() : ll`system:no`();

        const embed = new RichEmbed()
            .setTitle(ll`commands:help.embed.details.title`({ command: command.fullName }))
            .addField(ll`commands:help.embed.details.fields.format.name`(), `\`${format}\``)
            .addField(ll`commands:help.embed.details.fields.description.name`(), description)
            .addField(ll`commands:help.embed.details.fields.canUse.name`(), canUse)
            .setColor(embedColor);

        message.channel.send(embed).catch(console.error);
    }

    async getPrefix() {
        if (!this.guild) {
            return `${defaults.prefix} `;
        }

        const guild = await Guild.findByPk(this.guild.id);

        return guild && guild.prefix || `${defaults.prefix} `;
    }

    getAvailableCommands(isGuild, caller) {
        const commands = new CommandRegistry();
        this.client.commands.commands
            .filter(command => !command.guildOnly || isGuild)
            .filter(command => command.hasPermissions(caller) === true)
            .forEach(command => commands.register(command));
        return commands;
    }
}

function localize(maybeLocalizedString, options) {
    if (maybeLocalizedString instanceof LocalizedString) {
        return maybeLocalizedString.localize(options);
    }
    return maybeLocalizedString;
}