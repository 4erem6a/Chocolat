import Command from "../../processing/commands/Command";
import { name, description, group, format, guildOnly } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";
import GuildMember from "../../models/GuildMember";
import { parseMember } from "./../../utils/parseMention";
import localizeTime from "../../utils/localizeTime";

@name("time")
@group("voicexp")
@description(ls`commands:voicexp.time.description`)
@format(ls`commands:voicexp.time.format`)
@guildOnly
export default class PingCommand extends Command {
    async run(message, [member]) {
        if (!member) {
            const [guildMember] = await GuildMember.findOrBuild({
                where: { userId: message.author.id, guildId: this.guild.id },
                defaults: { userId: message.author.id, guildId: this.guild.id }
            });

            return ll`commands:voicexp.time.messages.get`({
                time: localizeTime(guildMember.voiceTime)
            });
        }

        member = parseMember(this.guild, member);

        if (!member) {
            return ll`commands:voicexp.time.messages.memberNotFound`();
        }

        const [guildMember] = await GuildMember.findOrBuild({
            where: { userId: member.user.id, guildId: this.guild.id },
            defaults: { userId: member.user.id, guildId: this.guild.id }
        });

        return ll`commands:voicexp.time.messages.member`({
            member,
            time: localizeTime(guildMember.voiceTime)
        });
    }
}