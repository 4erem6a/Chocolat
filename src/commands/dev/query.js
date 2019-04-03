import Command from "../../processing/commands/Command";
import { name, description, group, format } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";
import config from "../../../config";
import { RichEmbed } from "discord.js";

const CODE_BLOCK_PATTERN = /```.*\n((?:.|\s)*)```/;

@name("query")
@group("dev")
@description(ls`commands:dev.query.description`)
@format(ls`commands:dev.query.format`)
export default class PingCommand extends Command {
    hasPermissions(user) {
        return config.owner == user.id
            || ll`messages:errors.missingPermissions`();
    }

    parseArgs(rest) {
        if (CODE_BLOCK_PATTERN.test(rest))
            rest = rest.match(CODE_BLOCK_PATTERN)[1];
        return rest.trim();
    }

    async run(message, query) {
        if (!query) {
            return ll`commands:dev.query.messages.noQuery`();
        }
        const dialect = this.client.sequelize.options.dialect;
        try {
            const time = Date.now();
            const [result, dataOrStatement] = await this.client.sequelize.query(query);
            const elapsed = Date.now() - time;
            const embed = new RichEmbed()
                .setTitle(ll`commands:dev.query.embed.result.title`({ dialect }))
                .addField(ll`commands:dev.query.embed.result.fields.query.name`(), query)
                .setColor(config.embedColor);
            if (dialect == "postgres") {
                embed.addField(
                    ll`commands:dev.query.embed.result.fields.rowCount.name`(),
                    dataOrStatement.rowCount
                );
            }
            embed.addField(
                ll`commands:dev.query.embed.result.fields.time.name`(),
                ll`commands:dev.query.embed.result.fields.time.value`({ time: elapsed }),
            );
            await message.reply(embed);
            if (query.toUpperCase().startsWith("SELECT")) {
                result.forEach(item =>
                    message.channel.send(`\`\`\`json\n${JSON.stringify(item, null, 4)}\`\`\``)
                );
            }
        } catch (error) {
            return ll`commands:dev.query.messages.error`({ error: error.message });
        }
    }
}