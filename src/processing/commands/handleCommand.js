import CommandParser from "./CommandParser";

export default function handleCommand(message) {
    if (message.author.bot || message.system) {
        return;
    }

    const prefix = process.env.PREFIX;
    
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

    command.invoke(message.client, message, parser.rest());
}