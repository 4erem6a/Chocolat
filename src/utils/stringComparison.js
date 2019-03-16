export function compareStrings(str1, str2) {
    const [primary, secondary] = str1.length > str2.length
        ? [str2, str1]
        : [str1, str2];
    let result = 0;
    primary.split("").forEach((c, i) =>
        result += c == secondary[i] ? -1 : 1
    );
    return result;
}

export function stringComparator(string) {
    return (a, b) => compareStrings(a, string) - compareStrings(b, string);
}