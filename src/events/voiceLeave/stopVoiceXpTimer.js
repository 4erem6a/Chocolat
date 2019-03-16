import stopVoiceXpTimer from "../../utils/stopVoiceXpTimer";

export default async (client, oldMember, newMember) => stopVoiceXpTimer(newMember);