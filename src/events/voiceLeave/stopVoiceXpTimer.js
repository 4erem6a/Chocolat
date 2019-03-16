import stopVoiceXpTimer from "../../utils/stopVoiceXpTimer";

export default (client, oldMember, newMember) => {
    if (newMember.user.bot) {
        return;
    }
    stopVoiceXpTimer(newMember);
};