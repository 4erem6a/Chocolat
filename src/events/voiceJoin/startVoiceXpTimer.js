import startVoiceXpTimer from "../../utils/startVoiceXpTimer";

export default (client, oldMember, newMember) => {
    if (newMember.user.bot) {
        return;
    }
    startVoiceXpTimer(newMember);
};