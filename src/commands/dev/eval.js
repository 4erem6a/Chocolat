/* eslint-disable no-unused-vars */
import { name, group, format, description } from "../../processing/commands/decorators";
import Command from "../../processing/commands/Command";
import { ls, ll } from "../../utils/LocalizedString";
import { inspect } from "util";

const config = require("../../../config");

const CODE_BLOCK_PATTERN = /```.*\n((?:.|\s)*)```/;

@name("eval")
@group("dev")
@description(ls`commands:dev.eval.description`)
@format(ls`commands:dev.eval.format`)
export default class EvalCommand extends Command {
    hasPermissions(user) {
        return config.owner == user.id
            || ll`messages:errors.missingPermissions`();
    }

    parseArgs(rest) {
        if (CODE_BLOCK_PATTERN.test(rest))
            rest = rest.match(CODE_BLOCK_PATTERN)[1];
        return rest;
    }

    async run(message, js) {
        const client = this.client;
        const guild = this.guild;
        const time = new Date();
        const reply = message.reply.bind(message);
        const send = message.channel.send.bind(message.channel);
        const Discord = require("discord.js");

        try {
            let result = eval(js);

            if (result instanceof Promise) {
                result = await result;
            }

            const executionTime = new Date().getTime() - time.getTime();

            let inspected = inspect(result, { depth: 0, compact: false });
            if (inspected.length >= 2000) {
                inspected = inspect(result, { depth: -1, compact: false });
            }

            return ll`commands:dev.eval.messages.result`({
                time: executionTime,
                result: `\`\`\`js\n${inspected}\`\`\``
            });
        } catch(error) {
            return ll`commands:dev.eval.messages.error`({
                stack: `\`\`\`${error.stack}\`\`\``
            });
        }
    }
}