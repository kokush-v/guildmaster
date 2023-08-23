import { ChannelType, Client, Events, Guild, GuildMember, Role } from "discord.js";
import rolesService from "../../db/services/roles.service";
import userService from "../../db/services/user.service";
import guildService from "../../db/services/guild.service";
import channelService from "../../db/services/channel.service";
import memberService from "../../db/services/member.service";
import memberRolesService from "../../db/services/member-roles.service";

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

			rolesService.scan(guilds);
			userService.scan(guilds);
			guildService.scan(guilds);
			memberService.scan(guilds);
			memberRolesService.scan(guilds);
			channelService.scan(guilds);
		});

		// Guild Events

		this.botClient.on(Events.GuildCreate, (guild) => {
			userService.scan([guild]);
			rolesService.scan([guild]);
			guildService.addNewGuild(guild);
			channelService.scan([guild]);
			memberService.scan([guild]);
		});

		this.botClient.on(Events.GuildUpdate, (oldGuild, newGuild) => {
			guildService.addNewGuild(newGuild);
			console.log(`guild ${newGuild.name} was edited`);
		});

		this.botClient.on(Events.GuildDelete, (guild) => {
			guildService.removeGuild(guild);
			console.log(`guild ${guild.name} was removed`);
		});

		// Member events

		this.botClient.on(Events.GuildMemberAdd, async (member) => {
			memberService.addNewMember(member);
			userService.addNewUser(member);
			rolesService.setOldRoles(member);
			member.roles.add(member.guild.roles.cache.find((role) => role.name === "User") as Role);
			console.log(`new member ${member.user.username} just join guild ${member.guild.name}`);
		});

		this.botClient.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
			memberService.updateMember(newMember);
			memberRolesService.checkRoleMembers(newMember, oldMember as GuildMember);
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

		this.botClient.on(Events.UserUpdate, async (oldUser, newUser) => {
			userService.updateUser(newUser);
			console.log(`user ${newUser.username} was edited`);
		});

		// Channel events

		this.botClient.on(Events.ChannelCreate, (channel) => {
			channelService.addNewChannel(channel);
			console.log(`channel ${channel.name} was created `);
		});

		this.botClient.on(Events.ChannelUpdate, (oldChannel, newChannel) => {
			if (newChannel.type === ChannelType.GuildText || newChannel.type === ChannelType.GuildVoice) {
				channelService.addNewChannel(newChannel);
				console.log(`channel ${newChannel.name} was updated `);
			}
		});

		this.botClient.on(Events.ChannelDelete, (channel) => {
			if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
				channelService.removeChannel(channel);
				console.log(`channel ${channel.name} was removed `);
			}
		});

		// Role events

		this.botClient.on(Events.GuildRoleCreate, (role) => {
			rolesService.addNewRole(role);
			console.log(`role ${role.name} was added`);
		});
		this.botClient.on(Events.GuildRoleUpdate, (oldRole, newRole) => {
			rolesService.addNewRole(newRole);
			console.log(`role ${newRole.name} was updated`);
		});
		this.botClient.on(Events.GuildRoleDelete, (role) => {
			rolesService.removeRole(role);
			console.log(`role ${role.name} was removed`);
		});
	}
}

export default BotWatcher;
