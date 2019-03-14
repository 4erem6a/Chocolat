import requireAll from "require-all";

export default function loadEvents(emitter, dirname) {
    const dirs = requireAll({ dirname });
    for (const dir in dirs) {
        for (const filename in dirs[dir]) {
            const eventHandler = dirs[dir][filename].default || dirs[dir][filename];
            emitter.on(dir, eventHandler.bind(undefined, emitter));
        }
    }
}