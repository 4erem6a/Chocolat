import { Client } from "discord.js";

import loadCommands from "./processing/commands/loadCommands";

import loadEvents from "./processing/events/loadEvents";

import dbinit from "./dbinit";

if (process.env.NODE_ENV == "development") {
    require("dotenv").config();
}

const client = new Client();

client.commands = loadCommands(`${__dirname}/commands`);

loadEvents(client, `${__dirname}/events`);

client.once("ready", async () => {
    client.sequelize = await dbinit();
    client.emit("sync");
});

client.once("sync", () => client.synced = true);

client.login(process.env.TOKEN).catch(console.error);