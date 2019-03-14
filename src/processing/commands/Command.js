import CommandParser from "./CommandParser";

export default class Command {
    group = "General";
    guildOnly = false;

    constructor(options) {
        Object.assign(this, options);
    }

    async invoke(client, message, rawArgs) {
        if (this.guildOnly && message.channel.type != "text") {
            return;
        }

        this.client = client;
        this.guild = message.guild;
        this.member = message.member;

        let args = await this.parseArgs(rawArgs);
        if (this.transformArgs) {
            args = await this.transformArgs(args);
        }

        const hasPermissions = await this.hasPermissions(this.guildOnly ? this.member : message.author);
        if (hasPermissions !== true) {
            if (typeof hasPermissions == "string") {
                message.reply(hasPermissions);
            }
            return;
        }

        const isValid = await this.validate(message, args);
        if (isValid !== true) {
            if (typeof isValid == "string") {
                message.reply(isValid);
            }
            return;
        }

        const result = await this.run(message, args);
        if (typeof result == "string") {
            message.reply(result);
        }

        if (this.deleteMessage && message.deletable) {
            message.delete();
        }
    }

    run() { return; }

    parseArgs(raw) {
        return CommandParser.parts(raw);
    }

    hasPermissions() { return true; }

    validate() { return true; }
}