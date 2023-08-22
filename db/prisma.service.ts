import { Channel, Guild, GuildBan, GuildManager, GuildMember, Role, User } from "discord.js";
import prismaActions from "./prisma.actions";
import { convertToObject } from "typescript";

class PrismaService {
	// Users

	async guildUsersScan(guilds: Guild[]) {
		console.log("scanning for new users");
		guilds.forEach(async (guild) => {
			let users = await guild?.members.fetch();
			let count = 0;

			users.forEach(async (userMebmer) => {
				if (!(await prismaActions.getUser(userMebmer.id))) {
					console.log(`adding new user ${userMebmer.user.username}`);
					count++;
					prismaActions.addUser(userMebmer);
				}
			});

			if (count > 0) {
				console.log(`added ${count} new users`);
			} else {
				console.log("no new users");
			}
		});
	}

	async addNewUser(guildMember: GuildMember) {
		const id = guildMember.user.id;

		if (!(await prismaActions.getUser(id))) {
			console.log(`adding new user ${guildMember.user.username}`);
			prismaActions.addUser(guildMember);
		}
	}

	async updateUser(user: User) {
		const getUser = await prismaActions.getUser(user.id);
		if (getUser) {
			await prismaActions.updateUser(user);
		} else {
			console.log("no user");
		}
	}

	// Roles members

	async checkRoleMembers(newMember: GuildMember, oldMember: GuildMember) {
		const addedRoles = newMember.roles.cache.filter((role) => !oldMember.roles.cache.has(role.id));
		const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));

		if (addedRoles.size > 0) {
			addedRoles.forEach((role) => {
				this.addNewRoleMember(role.id, newMember.id);
			});
		}

		if (removedRoles.size > 0) {
			removedRoles.forEach((role) => {
				this.removeRoleMember(role.id, newMember.id);
			});
		}
	}

	async scanRoleMembers(guilds: Guild[]) {
		console.log("scanning for new role members");
		guilds.forEach(async (guild) => {
			let users = await guild?.members.fetch();
			let count = 0;

			users.forEach(async (userMebmer) => {
				if (!(await prismaActions.getUser(userMebmer.id))) {
					count++;
					prismaActions.addUser(userMebmer);
				}
			});

			if (count > 0) {
				console.log(`added ${count} new role members`);
			} else {
				console.log("no new role members");
			}
		});
	}

	async addNewRoleMember(roleId: string, memberId: string) {
		if (!(await prismaActions.getRoleMember(roleId, memberId))) {
			prismaActions.addRoleMember(roleId, memberId);
		}
	}
	async removeRoleMember(roleId: string, memberId: string) {
		const roleMember = await prismaActions.getRoleMember(roleId, memberId);
		if (roleMember) prismaActions.removeRoleMember(roleMember.id);
	}

	// Roles

	async guildRolesScan(guilds: Guild[]) {
		console.log("scanning for new roles");
		guilds.map(async (guild) => {
			let roles = guild?.roles.cache.map((role) => role);
			let count = 0;

			roles.forEach(async (role) => {
				if (!(await prismaActions.getRole(role.id))) {
					if (role.name === "@everyone") return;
					console.log(`adding new role ${role.name}`);
					count++;
					prismaActions.addRole(role);
				}
			});

			if (count > 0) {
				console.log(`added ${count} new roles`);
			} else {
				console.log("no new roles");
			}
		});
	}

	async setOldRoles(member: GuildMember) {
		const roles = await prismaActions.getOldRoles(member.id);
		roles.forEach((elem) => {
			const role = member.guild.roles.cache.get(elem.roles_id as string);
			console.log(role?.name);
			if (role) member.roles.add(role);
		});
	}

	async addNewRole(role: Role) {
		if (!(await prismaActions.getRole(role.id))) prismaActions.addRole(role);
	}

	async updateRole(role: Role) {
		if (await prismaActions.getRole(role.id)) prismaActions.updateRole(role);
	}

	async removeRole(role: Role) {
		if (await prismaActions.getRole(role.id)) prismaActions.removeRole(role);
	}

	// Guilds

	async addNewGuild(guild: Guild) {
		if (!(await prismaActions.getGuild(guild.id))) prismaActions.addGuild(guild);
	}

	async updateGuild(guild: Guild) {
		if (await prismaActions.getGuild(guild.id)) prismaActions.updateGuild(guild);
	}

	async removeGuild(guild: Guild) {
		if (await prismaActions.getGuild(guild.id)) prismaActions.removeGuild(guild);
	}

	// Channels

	async addNewChannels(guild: Guild) {
		const channels = await guild.channels.fetch();

		channels.map(async (channel) => {
			if (channel)
				if (!(await prismaActions.getChannel(channel.id))) {
					await prismaActions.addChannel(channel);
				}
		});
	}

	async addNewChannel(channel: Channel) {
		if (!(await prismaActions.getChannel(channel.id))) {
			await prismaActions.addChannel(channel);
		}
	}

	async updateChannel(channel: Channel) {
		if (await prismaActions.getChannel(channel.id)) {
			await prismaActions.updateChannel(channel);
		}
	}

	async removeChannel(channel: Channel) {
		if (await prismaActions.getChannel(channel.id)) {
			await prismaActions.removeChannel(channel);
		}
	}

	// Members

	async addNewMembers(guild: Guild) {
		const members = await guild.members.fetch();
		members.map(async (member) => {
			if (!(await prismaActions.getMember(member.guild.id, member.id))) {
				await prismaActions.addMember(member);
			}
		});
	}

	async addNewMember(member: GuildMember) {
		if (!(await prismaActions.getMember(member.guild.id, member.id))) {
			await prismaActions.addMember(member);
		}
	}

	async updateMember(member: GuildMember) {
		const getUser = await prismaActions.getMember(member.guild.id, member.id);
		if (getUser) {
			await prismaActions.updateMember(getUser.id, member);
		} else {
			console.log("no user");
		}
	}

	async removeMember(member: GuildMember) {
		const getUser = await prismaActions.getMember(member.guild.id, member.id);
		if (getUser) {
			await prismaActions.removeMember(getUser.id);
		} else {
			console.log("no user");
		}
	}

	async BanOrUnBan({ guild, user }: GuildBan) {
		const guildMember = await prismaActions.getMember(guild.id, user.id);
		if (guildMember)
			if (guildMember.ban) {
				prismaActions.unBanMember(guildMember.id);
			} else {
				prismaActions.banMember(guildMember.id);
			}
	}
}

export default new PrismaService();
