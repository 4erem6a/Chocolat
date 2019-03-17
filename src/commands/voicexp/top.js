import Command from "../../processing/commands/Command";
import { name, description, guildOnly, group } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";
import GuildMember from "../../models/GuildMember";
import MessageFormatter from "../../utils/MessageFormatter";
import localizeTime from "../../utils/localizeTime";

@name("top")
@group("voicexp")
@description(ls`commands:voicexp.topGuild.description`)
@guildOnly
export default class TopGuildCommand extends Command {
    async run() {
        let guildMembers = await GuildMember.findAll({
            where: { guildId: this.guild.id },
            order: [["voiceTime", "DESC"]],
            limit: 10
        });

        const formatter = new MessageFormatter();

        guildMembers = guildMembers.map(member =>
            [member, this.guild.member(member.userId)]
        ).filter(([, member]) => !!member);
        
        guildMembers.forEach(([guildMember, member], index) => formatter
            .appendln(`[${index}]${" ".repeat(index == 10 ? 4 : 5)}#${member.user.tag}`)
            .appendln(`${" ".repeat(8)}\t${localizeTime(guildMember.voiceTime)}`)
        );

        if (guildMembers.length == 0) {
            formatter.appendln(ll`system:empty`());
        }

        return ll`commands:voicexp.topGuild.messages.top`({
            guild: this.guild.name,
            count: guildMembers.length,
            top: formatter.toCode("pl")
        });
    }
}