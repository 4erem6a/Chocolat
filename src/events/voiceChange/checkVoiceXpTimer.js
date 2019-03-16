import Guild from "../../models/Guild";
import stopVoiceXpTimer from "../../utils/stopVoiceXpTimer";
import startVoiceXpTimer from "../../utils/startVoiceXpTimer";

export default async (client, oldMember, newMember) => {
    if (newMember.user.bot) {
        return;
    }

    const [guild] = await Guild.findOrBuild({
        where: { id: newMember.guild.id },
        defaults: { id: newMember.guild.id }
    });

    const oldIgnore = oldMember.voiceChannel.permissionOverwrites.has(guild.voiceIgnoreRole);
    const newIgnore = newMember.voiceChannel.permissionOverwrites.has(guild.voiceIgnoreRole);

    if (!oldIgnore && newIgnore) {
        await stopVoiceXpTimer(newMember);
    }

    if (oldIgnore && !newIgnore) {
        await startVoiceXpTimer(newMember);
    }
};