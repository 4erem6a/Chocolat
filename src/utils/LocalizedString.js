import i18next from "i18next";

export default class LocalizedString {
    constructor(key) {
        this.key = key;
    }

    localize(options) {
        return i18next.t(this.key, options);
    }
}

export function ls(...args) {
    return new LocalizedString(String.raw(...args));
}

export function ll(...args) {
    const ls = new LocalizedString(String.raw(...args));
    return ls.localize.bind(ls);
}