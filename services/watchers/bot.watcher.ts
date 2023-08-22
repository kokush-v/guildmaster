import { ChannelType, Client, Events, Guild, GuildMember } from "discord.js";
import prismaService from "../../db/prisma.service";

class BotWatcher {
	botClient: Client;

	constructor(client: Client) {
		this.botClient = client;
	}

	start() {
		// Ready event

		this.botClient.once(Events.ClientReady, async (bot) => {
			console.log("Discord bot is ready!");
			const guilds = bot.guilds.cache.map((guild) => guild);

			prismaService.guildRolesScan(guilds);
			prismaService.guildUsersScan(guilds);
		});

		// Guild Events

		this.botClient.on(Events.GuildCreate, (guild) => {
			prismaService.guildUsersScan([guild]);
			prismaService.guildRolesScan([guild]);
			prismaService.addNewGuild(guild);
			prismaService.addNewChannels(guild);
			prismaService.addNewMembers(guild);
		});

		this.botClient.on(Events.GuildUpdate, (oldGuild, newGuild) => {
			prismaService.updateGuild(newGuild);
			console.log(`guild ${newGuild.name} was edited`);
		});

		this.botClient.on(Events.GuildDelete, (guild) => {
			prismaService.removeGuild(guild);
			console.log(`guild ${guild.name} was removed`);
		});

		// Member events

		this.botClient.on(Events.GuildMemberAdd, async (member) => {
			prismaService.addNewMember(member);
			prismaService.addNewUser(member);
			prismaService.setOldRoles(member);
			console.log(`new member ${member.user.username} just join guild ${member.guild.name}`);
		});

		this.botClient.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
			prismaService.updateMember(newMember);
			prismaService.checkRoleMembers(newMember, oldMember as GuildMember);
			console.log(`user ${newMember.user.username} was edited`);
		});

		//Ban events

		this.botClient.on(Events.GuildBanAdd, (ban) => {
			console.log(`user ${ban.user.username} was banned`);
		});

		this.botClient.on(Events.GuildBanRemove, (ban) => {
			console.log(`user ${ban.user.username} was unbanned`);
		});

		// User events

		this.botClient.on(Events.UserUpdate, (oldUser, newUser) => {
			prismaService.updateUser(newUser);
			console.log(`user ${newUser.username} was edited`);
		});

		// Channel events

		this.botClient.on(Events.ChannelCreate, (channel) => {
			prismaService.addNewChannel(channel);
			console.log(`channel ${channel.name} was created `);
		});

		this.botClient.on(Events.ChannelUpdate, (oldChannel, newChannel) => {
			if (newChannel.type === ChannelType.GuildText || newChannel.type === ChannelType.GuildVoice) {
				prismaService.updateChannel(newChannel);
				console.log(`channel ${newChannel.name} was updated `);
			}
		});

		this.botClient.on(Events.ChannelDelete, (channel) => {
			if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
				prismaService.removeChannel(channel);
				console.log(`channel ${channel.name} was removed `);
			}
		});

		// Role events

		this.botClient.on(Events.GuildRoleCreate, (role) => {
			prismaService.addNewRole(role);
			console.log(`role ${role.name} was added`);
		});
		this.botClient.on(Events.GuildRoleUpdate, (oldRole, newRole) => {
			prismaService.updateRole(newRole);
			console.log(`role ${newRole.name} was updated`);
		});
		this.botClient.on(Events.GuildRoleDelete, (role) => {
			prismaService.removeRole(role);
			console.log(`role ${role.name} was removed`);
		});
	}
}

export default BotWatcher;
