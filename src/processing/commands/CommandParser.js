export default class CommandParser {
    position = 0;

    constructor(raw, options = {}) {
        this.raw = raw.trim();
        this.options = Object.assign(DEFAULT_PARSER_OPTIONS, options);
    }

    static part(raw, options = {}) {
        return new CommandParser(raw, options).part();
    }
    
    static parts(raw, options = {}) {
        return new CommandParser(raw, options).parts();
    }

    rest() {
        return this.raw.substring(this.position);
    }

    parts() {
        const parts = [];
        while (this.checkLength()) {
            if (this.isSeparator(this.peek())) {
                this.position++;
                continue;
            }
            const part = this.part();
            if (!part)
                break;
            parts.push(part);
        }
        return parts;
    }

    part() {
        let current = this.peek();
        if (this.options.allowQuotes && this.isQuote(current))
            return this.quoted();
        let buffer = "";
        while (this.checkLength() && !this.isSeparator(current)) {
            buffer += current;
            current = this.skip();
        }
        return buffer;
    }

    quoted() {
        const quote = this.peek();
        const closing = this.closingQuote(quote);
        let buffer = "";
        let current = this.skip();
        while (current != closing) {
            if (!this.checkLength())
                return null;
            if (current == "\\") {
                if (this.peek(1) == closing)
                    buffer += this.skip();
                else
                    buffer += current;
            } else
                buffer += current;
            current = this.skip();
        }
        this.skip();
        return buffer;
    }

    isSeparator(string) {
        return this.options.argumentSeparator.test(string);
    }

    checkLength(offset = 0) {
        return this.position + offset < this.raw.length
            && this.position + offset >= 0;
    }

    peek(offset = 0) {
        return this.position + offset < this.raw.length
            ? this.raw[this.position + offset]
            : "\0";
    }

    skip(offset = 1) {
        this.position += offset;
        return this.peek();
    }

    isQuote(string) {
        const openingQuotes = this.options.quotes.map(q => q[0]);
        return openingQuotes.includes(string);
    }

    closingQuote(quote) {
        const flatQuotes = this.options.quotes.reduce((a, b) => a.concat(b));
        return flatQuotes[flatQuotes.indexOf(quote) + 1] || quote;
    }
}

export const DEFAULT_PARSER_OPTIONS = {
    argumentSeparator: /\s/,
    allowQuotes: true,
    quotes: [ ["\"", "\""], [ "(", ")" ] ],
    allowEscape: true
};