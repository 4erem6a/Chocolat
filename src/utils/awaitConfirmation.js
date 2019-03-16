import { ll } from "./LocalizedString";

export default async function awaitConfirmation(message, prompt, options = { time: 30000 }) {
    await message.reply(prompt);

    const yes = ll`system:yes`();
    const no  = ll`system:no`();
    
    const { content: answer } = (await message.channel.awaitMessages(
        ({ content }) => content.toLowerCase() == yes.toLowerCase()
            || content.toLowerCase() == no.toLowerCase(),
        Object.assign(options, { maxMatches: 1 })
    )).first();

    return answer.toLowerCase() == yes.toLowerCase();
}