export function property(name, value) {
    return descriptor => {
        descriptor.elements.push({
            kind: "field",
            key: name,
            placement: "own",
            descriptor: {
                writable: true,
                enumerable: true,
                configurable: true
            },
            initializer: () => value
        });
    };
}

export const name = (name) => property("name", name);

export const group = (name) => property("group", name);

export const description = (description) => property("description", description);

export const details = (details) => property("details", details);

export const format = (format) => property("format", format);

export const guildOnly = property("guildOnly", true);

export const deleteMessage = property("deleteMessage", true);