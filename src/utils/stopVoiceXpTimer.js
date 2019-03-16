import GuildMember from "../models/GuildMember";

export default async function stopVoiceXpTimer(member) {
    const [guildMember] = await GuildMember.findOrBuild({
        where: {
            guildId: member.guild.id,
            userId: member.user.id
        },
        defaults: {
            guildId: member.guild.id,
            userId: member.user.id
        }
    });

    if (!guildMember.voiceTimerStart) {
        return;
    }

    const time = new Date().getTime() - guildMember.voiceTimerStart;

    guildMember.voiceTime = Number(guildMember.voiceTime) + time;
    guildMember.voiceTimerStart = null;

    await guildMember.save();
}