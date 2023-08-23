import { users, PrismaClient, roles, guilds, channels, guild_members } from "@prisma/client";
import { Channel, ChannelType, Guild, GuildMember, Role, User } from "discord.js";
import { create } from "ts-node";

const prisma = new PrismaClient();

class PrismaActions {
	// Users

	async upsertUser({ user, roles }: GuildMember) {
		const filteredRoles = roles.cache.filter((role) => role.name !== "@everyone");

		await prisma.users.upsert({
			where: {
				id: user.id,
			},
			update: {
				username: user.username,
				roles: {
					create: filteredRoles.map((role) => ({
						roles_id: role.id,
					})),
				},
			},
			create: {
				id: user.id,
				username: user.username,
				roles: {
					create: filteredRoles.map((role) => ({
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

	async updateUser({ id, username }: User) {
		await prisma.users.update({ where: { id: id }, data: { username: username } });
		await prisma.$disconnect();
	}

	async getUser(id: string): Promise<users | null> {
		const user = await prisma.users.findUnique({ where: { id: id } });
		await prisma.$disconnect();
		return user;
	}

	// Role members

	async addRoleMember(roleId: string, memberId: string) {
		await prisma.member_roles.create({
			data: {
				user_id: memberId,
				roles_id: roleId,
			},
		});

		await prisma.$disconnect();
	}

	async removeRoleMember(id: number) {
		await prisma.member_roles.delete({ where: { id: id } });
		await prisma.$disconnect();
	}

	async getRoleMember(roleId: string, memberId: string) {
		const roleMember = await prisma.member_roles.findFirst({ where: { roles_id: roleId, user_id: memberId } });
		await prisma.$disconnect();
		return roleMember;
	}

	// Roles

	async upsertRole({ id, guild, name, color }: Role) {
		await prisma.roles.upsert({
			where: {
				id: id,
			},
			update: {
				name: name,
				color: color,
			},
			create: {
				id: id,
				guild_id: guild.id,
				name: name,
				color: color,
			},
		});
		await prisma.$disconnect();
	}

	async getRole(id: string): Promise<roles | null> {
		const role = await prisma.roles.findUnique({ where: { id: id } });
		await prisma.$disconnect();
		return role;
	}

	async getOldRoles(id: string) {
		const roles = await prisma.member_roles.findMany({ where: { user_id: id } });
		await prisma.$disconnect();
		return roles;
	}

	async removeRole(role: Role) {
		await prisma.roles.delete({ where: { id: role.id } });
		await prisma.$disconnect();
	}

	// Guilds

	async upsertGuild(guild: Guild) {
		await prisma.guilds.upsert({
			where: {
				id: guild.id,
			},
			create: {
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
			update: {
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

	async getGuild(id: string): Promise<guilds | null> {
		const guild = await prisma.guilds.findUnique({
			where: {
				id: id,
			},
		});
		await prisma.$disconnect();
		return guild;
	}

	async removeGuild(guild: Guild) {
		await prisma.guilds.delete({ where: { id: guild.id } });
		await prisma.$disconnect();
	}

	// Channels

	async upsertChannel(channel: Channel) {
		try {
			switch (channel.type) {
				case ChannelType.GuildText:
					await prisma.channels.upsert({
						where: {
							id: channel.id,
						},
						create: {
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
						update: {
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
					await prisma.channels.upsert({
						where: {
							id: channel.id,
						},
						create: {
							id: channel.id,
							guild_id: channel.guild.id,
							name: channel.name,
							type: channel.type,
							nsfw: channel.nsfw,
							parent_id: channel.parentId,
							rate_limit_per_user: channel.rateLimitPerUser,
							flags: channel.flags.bitfield,
						},
						update: {
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

	async getChannel(id: string): Promise<channels | null> {
		const channel = await prisma.channels.findUnique({
			where: {
				id: id,
			},
		});
		await prisma.$disconnect();
		return channel;
	}

	async removeChannel(channel: Channel) {
		await prisma.channels.delete({
			where: {
				id: channel.id,
			},
		});
		await prisma.$disconnect();
	}

	// Members

	async upsertMember(member: GuildMember, id: number) {
		await prisma.guild_members.upsert({
			where: {
				id: id,
			},
			create: {
				guild_id: member.guild.id,
				user_id: member.user.id,
				joined_at: member.joinedAt,
				nick: member.nickname,
				avatar: member.avatar,
				premium_since: member.premiumSince,
				pending: member.pending,
				permissions: member.permissions.bitfield,
			},
			update: {
				joined_at: member.joinedAt,
				nick: member.nickname,
				avatar: member.avatar,
				premium_since: member.premiumSince,
				pending: member.pending,
				permissions: member.permissions.bitfield,
			},
		});
	}

	async getMember(guild_id: string, user_id: string): Promise<guild_members | null> {
		const member = await prisma.guild_members.findFirst({
			where: {
				user_id: user_id,
				guild_id: guild_id,
			},
		});
		await prisma.$disconnect();
		return member;
	}

	async updateMember(id: number, member: GuildMember) {
		await prisma.guild_members.update({
			where: {
				id: id,
			},
			data: {
				guild_id: member.guild.id,
				user_id: member.id,
				joined_at: member.joinedAt,
				nick: member.nickname,
				avatar: member.avatar,
				premium_since: member.premiumSince,
				pending: member.pending,
				permissions: member.permissions.bitfield,
			},
		});
		await prisma.$disconnect();
	}

	async banMember(id: number) {
		await prisma.guild_members.update({
			where: {
				id: id,
			},
			data: {
				ban: true,
			},
		});
		await prisma.$disconnect();
	}

	async unBanMember(id: number) {
		await prisma.guild_members.update({
			where: {
				id: id,
			},
			data: {
				ban: false,
			},
		});
		await prisma.$disconnect();
	}

	async removeMember(id: number) {
		await prisma.guild_members.delete({
			where: {
				id: id,
			},
		});
		await prisma.$disconnect();
	}
}

export default new PrismaActions();
