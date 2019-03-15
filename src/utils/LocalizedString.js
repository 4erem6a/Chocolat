import i18next from "i18next";

export default class LocalizedString {
    constructor(key) {
        this.key = key;
    }

    localize(options) {
        return i18next.t(this.key, options);
    }

    l = this.localize;
}

export function ls([key]) {
    return new LocalizedString(key);
}