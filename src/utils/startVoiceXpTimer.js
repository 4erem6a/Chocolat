import Guild from "../models/Guild";
import GuildMember from "../models/GuildMember";

export default async function startVoiceXpTimer(member) {
    const [guild] = await Guild.findOrBuild({
        where: { id: member.guild.id },
        defaults: { id: member.guild.id }
    });

    if (member.roles.has(guild.voiceIgnoreRole)
        || member.voiceChannel.permissionOverwrites.has(guild.voiceIgnoreRole)) {
        return;
    }

    const [guildMember] = await GuildMember.findOrBuild({
        where: { userId: member.user.id, guildId: member.guild.id },
        defaults: { userId: member.user.id, guildId: member.guild.id }
    });

    guildMember.voiceTimerStart = new Date();

    await guildMember.save();
}