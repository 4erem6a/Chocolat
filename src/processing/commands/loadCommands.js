import requireAll from "require-all";
import CommandRegistry from "./CommandRegistry";

export default function loadCommands(dirname) {
    const registry = new CommandRegistry();
    const dirs = requireAll({
        dirname,
        resolve: command => {
            command = command.default || command;
            return typeof command == "function" ?
                new command() :
                command;
        }
    });
    for (const dir in dirs) {
        for (const filename in dirs[dir]) {
            const command = dirs[dir][filename];
            registry.register(command);
            console.log(`Command loaded: ${command.group}::${command.name}`);
        }
    }
    return registry;
}