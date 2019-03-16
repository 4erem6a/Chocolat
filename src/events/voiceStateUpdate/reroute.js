export default async (client, oldMember, newMember) => {
    if (!oldMember.voiceChannelID && newMember.voiceChannelID) {
        client.emit("voiceJoin", oldMember, newMember);
    }
    if (oldMember.voiceChannelID && !newMember.voiceChannelID) {
        client.emit("voiceLeave", oldMember, newMember);
    }
    if (oldMember.voiceChannelID && newMember.voiceChannelID) {
        client.emit("voiceChange", oldMember, newMember);
    }
};