import { stringComparator } from "./stringComparison";

export const USER_MENTION_PATTERN = /^<@!?([0-9]+)>$/;
export const ROLE_MENTION_PATTERN = /^<@&!?([0-9]+)>$/;
export const CHANNEL_MENTION_PATTERN = /^<#!?([0-9]+)>$/;
export const ID_PATTERN = /^[0-9]+$/;

export function parseMember(guild, raw) {
    if (USER_MENTION_PATTERN.test(raw))
        return guild.member(raw.match(USER_MENTION_PATTERN)[1]);
    if (ID_PATTERN.test(raw))
        return guild.member(raw);
    return guild.members.find(member => member.displayName == raw || member.user.username == raw)
        || findMatching(guild.members, raw, guild => guild.name);
}

export function parseUser(client, raw) {
    if (USER_MENTION_PATTERN.test(raw))
        return client.users.get(raw.match(USER_MENTION_PATTERN)[1]);
    if (ID_PATTERN.test(raw))
        return client.users.get(raw);
    return client.users.find(user => user.username == raw)
        || findMatching(client.users, raw, user => user.username);
}

export function parseRole(guild, raw) {
    if (ROLE_MENTION_PATTERN.test(raw))
        return guild.roles.get(raw.match(ROLE_MENTION_PATTERN)[1]);
    if (ID_PATTERN.test(raw))
        return guild.roles.get(raw);
    return guild.roles.find(role => role.name == raw)
        || findMatching(guild.roles, raw, role => role.name);
}

export function parseChannel(clientOrGuild, raw) {
    if (CHANNEL_MENTION_PATTERN.test(raw))
        return clientOrGuild.channels.get(raw.match(CHANNEL_MENTION_PATTERN)[1]);
    if (ID_PATTERN.test(raw))
        return clientOrGuild.channels.get(raw);
    return clientOrGuild.channels.find(channel => channel.name == raw)
        || findMatching(clientOrGuild.channels, raw, channel => channel.name);
}

function findMatching(collection, string, keyExtractor) {
    const matching = collection
        .map(keyExtractor)
        .sort(stringComparator(string))[0];
    if (matching && matching[0] == string[0])
        return collection.find(e => keyExtractor(e) == matching);
    return undefined;
}