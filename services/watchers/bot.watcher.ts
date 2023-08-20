import { Client, Events } from "discord.js";
import prismaService from "../../db/prisma.service";

class BotWatcher {
	botClient: Client;

	constructor(client: Client) {
		this.botClient = client;
	}

	start() {
		this.botClient.once(Events.ClientReady, async (bot) => {
			console.log("Discord bot is ready!");
			prismaService.guildMembersScan(bot.guilds.cache.map((guild) => guild));
		});

		this.botClient.on(Events.GuildCreate, (guild) => prismaService.guildMembersScan([guild]));

		this.botClient.on(Events.GuildMemberAdd, async (member) => {
			console.log(`new member ${member.user.username} just join guild ${member.guild.name}`);

			prismaService.addNewUser(member.user);
		});
	}
}

export default BotWatcher;
