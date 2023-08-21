import { UsersDB, PrismaClient, RolesDB, GuildsDB, ChannelsDB, GuildMembersDB } from "@prisma/client";
import { Channel, ChannelType, Guild, GuildMember, Role, User } from "discord.js";

const prisma = new PrismaClient();

class PrismaActions {
	async addUser({ user, roles }: GuildMember) {
		await prisma.usersDB.create({
			data: {
				id: user.id,
				username: user.username,
				roles: {
					create: roles.cache.map((role) => ({
						roles_id: role.id,
					})),
				},
			},
			include: {
				roles: true,
			},
		});
		await prisma.$disconnect();
	}

	async editUser({ id, username }: User) {
		await prisma.usersDB.update({ where: { id: id }, data: { username: username } });
		await prisma.$disconnect();
	}

	async getUser(id: string): Promise<UsersDB | null> {
		const user = await prisma.usersDB.findUnique({ where: { id: id } });
		await prisma.$disconnect();
		return user;
	}

	async addRole({ id, guild, name }: Role) {
		await prisma.rolesDB.create({
			data: {
				role_id: id,
				guild_id: guild.id,
				role_name: name,
			},
		});
		await prisma.$disconnect();
	}

	async getRole(id: string): Promise<RolesDB | null> {
		const role = await prisma.rolesDB.findUnique({ where: { role_id: id } });
		await prisma.$disconnect();
		return role;
	}

	async addGuild(guild: Guild) {
		await prisma.guildsDB.create({
			data: {
				id: guild.id,
				name: guild.name,
				icon: guild.icon,
				afk_channel_id: guild.afkChannelId,
				owner_id: guild.ownerId,
				joined_at: guild.joinedAt,
				discovery_splash: guild.discoverySplash,
				splash: guild.splash,
				afk_timeout: guild.afkTimeout,
				member_count: guild.memberCount,
				verification_level: guild.verificationLevel,
				default_message_notifications: guild.defaultMessageNotifications,
				max_presences: guild.maximumPresences,
				max_members: guild.maximumMembers,
				nsfw_level: guild.nsfwLevel,
				mfa_level: guild.mfaLevel,
				system_channel_id: guild.systemChannelId,
				rules_channel_id: guild.rulesChannelId,
				description: guild.description,
				banner: guild.banner,
				premium_tier: guild.premiumTier,
				premium_subscription_count: guild.premiumSubscriptionCount,
				preferred_locale: guild.preferredLocale,
				public_updates_channel_id: guild.publicUpdatesChannelId,
				permissions: guild.members.me?.permissions.bitfield,
			},
		});
		await prisma.$disconnect();
	}

	async getGuild(id: string): Promise<GuildsDB | null> {
		const guild = await prisma.guildsDB.findUnique({
			where: {
				id: id,
			},
		});
		await prisma.$disconnect();
		return guild;
	}

	async addChannel(channel: Channel) {
		try {
			switch (channel.type) {
				case ChannelType.GuildText:
					await prisma.channelsDB.create({
						data: {
							id: channel.id,
							guild_id: channel.guild.id,
							name: channel.name,
							topic: channel.topic,
							type: channel.type,
							nsfw: channel.nsfw,
							parent_id: channel.parentId,
							rate_limit_per_user: channel.rateLimitPerUser,
							flags: channel.flags.bitfield,
						},
					});
				case ChannelType.GuildVoice:
					await prisma.channelsDB.create({
						data: {
							id: channel.id,
							guild_id: channel.guild.id,
							name: channel.name,
							type: channel.type,
							nsfw: channel.nsfw,
							parent_id: channel.parentId,
							rate_limit_per_user: channel.rateLimitPerUser,
							flags: channel.flags.bitfield,
						},
					});
			}
		} catch (error) {}

		await prisma.$disconnect();
	}

	async getChannel(id: string): Promise<ChannelsDB | null> {
		const channel = await prisma.channelsDB.findUnique({
			where: {
				id: id,
			},
		});
		await prisma.$disconnect();
		return channel;
	}

	async addMember(member: GuildMember) {
		await prisma.guildMembersDB.create({
			data: {
				guild_id: member.guild.id,
				user_id: member.id,
				joined_at: member.joinedAt,
				nick: member.nickname,
				deaf: member.voice.deaf ? member.voice.deaf : false,
				mute: member.voice.mute ? member.voice.mute : false,
				avatar: member.avatar,
				premium_since: member.premiumSince,
				pending: member.pending,
				permissions: member.permissions.bitfield,
			},
		});
	}

	async getMember(guild_id: string, user_id: string): Promise<GuildMembersDB | null> {
		const member = await prisma.guildMembersDB.findFirst({
			where: {
				user_id: user_id,
				guild_id: guild_id,
			},
		});
		await prisma.$disconnect();
		return member;
	}
}

export default new PrismaActions();
