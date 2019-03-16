export default class MessageFormatter {
    constructor(text = "") {
        this.text = text;
    }

    append(text) {
        this.text += text;
        return this;
    }

    appendln(text) {
        return this.append(`${text}\n`);
    }

    appendCode(textOrLanguage, maybeText) {
        const language = maybeText && textOrLanguage;
        const text = maybeText || textOrLanguage;
        return this.append(`\`\`\`${language && `${language}\n` || ""}${text}\`\`\``);
    }

    toCode(language) {
        return `\`\`\`${language && `${language}\n` || ""}${this.text}\`\`\``;
    }

    [Symbol.toString]() {
        return this.text;
    }
}