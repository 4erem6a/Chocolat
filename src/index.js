import {
    Client
} from "discord.js";

import loadCommands from "./processing/commands/loadCommands";
import loadEvents from "./processing/events/loadEvents";

import dbinit from "./dbinit";

import i18next from "i18next";
import Backend from "i18next-node-fs-backend";

if (process.env.NODE_ENV == "development") {
    require("dotenv").config();
}

i18next
    .use(Backend)
    .init({
        fallbackLng: require("../locales/locales"),
        ns: ["system", "commands", "messages"],
        initImmediate: false,
        backend: {
            loadPath: `${__dirname}/../locales/{{lng}}/{{ns}}.yml`
        },
        interpolation: {
            escapeValue: false
        }
    }).then(() => console.log("Translations loaded"));

const client = new Client();

client.commands = loadCommands(`${__dirname}/commands`);

loadEvents(client, `${__dirname}/events`);

client.once("ready", async () => {
    client.sequelize = await dbinit();
    client.synced = true;
    client.emit("sync");
});

client.login(process.env.TOKEN).catch(console.error);