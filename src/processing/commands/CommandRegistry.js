import { Collection } from "discord.js";

export default class CommandRegistry {
    groups = new Collection()

    register(commandOrGroup) {
        if (typeof commandOrGroup == "string") {
            this.groups.set(commandOrGroup, new CommandGroup(commandOrGroup));
        } else {
            if (!this.groups.has(commandOrGroup.group)) {
                this.register(commandOrGroup.group);
            }
            this.groups.get(commandOrGroup.group).register(commandOrGroup);
        }
        return this;
    }

    unregister(command, group) {
        if (!this.has(command)) {
            return;
        }
        if (group && this.groups.has(group)) {
            this.groups.get(group).commands.delete(command);
        } else {
            this.groups.forEach(group => group.commands.delete(command));
        }
    }

    get(groupOrName, maybeName) {
        const group = maybeName ? groupOrName : undefined;
        const name = maybeName ? maybeName : groupOrName;
        if (!group) {
            return this.groups.array()
                .flatMap(g => g.commands.array())
                .find(c => c.name == name);
        } else {
            const _group = this.groups.find(g => g.name == group);
            return _group && _group.commands.find(c => c.name == name);
        }
    }

    has(groupOrName, maybeName) {
        return this.get(groupOrName, maybeName) ? true : false;
    }

    get commands() {
        return new Collection(
            this.groups.array()
                .flatMap(g => g.commands.array())
                .map(c => [c.name, c])
        );
    }
}

export class CommandGroup {
    commands = new Collection()

    constructor(name) {
        this.name = name;
    }

    register(command) {
        this.commands.set(command.name, command);
    }
}