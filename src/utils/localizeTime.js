import { ll } from "./LocalizedString";

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

export default function localizeTime(ms) {
    if (typeof ms != "number") {
        ms = Number(ms);
    }

    const days = Math.floor(ms / day);
    const hours = Math.floor(ms % day / hour);
    const minutes = Math.floor(ms % day % hour / minute);
    const seconds = Math.floor(ms % day % hour % minute / second);

    const result = [];

    if (days > 0)
        result.push(ll`system:time.day`({ count: days }));
    if (hours > 0)
        result.push(ll`system:time.hour`({ count: hours }));
    if (minutes > 0)
        result.push(ll`system:time.minute`({ count: minutes }));
    result.push(ll`system:time.second`({ count: seconds }));

    return result.join(" ");
}