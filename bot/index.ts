import { Client, Events, GatewayIntentBits, Guild, Partials, TextChannel } from "discord.js";
import botConfig from "./config";
import handleCommands from "./commands/commands-handler";
import prismaService from "../db/prisma.service";

const client = new Client({
	intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
	partials: [Partials.Channel],
});

client.once(Events.ClientReady, async () => {
	console.log("Discord bot is ready!");

	const guild = client.guilds.cache.get("925038171601895425") as Guild;

	prismaService.guildMembersScan(guild);
});

client.on(Events.GuildMemberAdd, async (member) => {
	console.log(`new member ${member.user.username} just join guild ${member.guild.name}`);

	prismaService.addNewUser(member.user);
});

client.on(Events.MessageCreate, handleCommands);

client.login(botConfig.BOT_TOKEN);

export default client;
