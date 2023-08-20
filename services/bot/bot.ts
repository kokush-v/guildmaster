import { Client, Events, GatewayIntentBits, Guild, Partials } from "discord.js";
import botConfig from "./config";
import handleCommands from "./commands/commands-handler";
import BotWatcher from "../watchers/bot.watcher";

class Bot {
	client: Client;
	watcher: BotWatcher;

	constructor() {
		this.client = new Client({
			intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
			partials: [Partials.Channel],
		});

		this.watcher = new BotWatcher(this.client);
	}

	start() {
		this.client.on(Events.MessageCreate, handleCommands);

		this.watcher.start();
		this.client.login(botConfig.BOT_TOKEN);
	}
}

const bot = new Bot();

bot.start();

export default bot;
