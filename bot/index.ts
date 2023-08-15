import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import botConfig from "./config";
import handleCommands from "./commands/commands-handler";

const client = new Client({
	intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
	partials: [Partials.Channel],
});

client.once(Events.ClientReady, () => {
	console.log("Discord bot is ready!");
});

client.on(Events.MessageCreate, handleCommands);

client.login(botConfig.BOT_TOKEN);

export default client;
