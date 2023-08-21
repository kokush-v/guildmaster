import { Guild, GuildManager, GuildMember } from "discord.js";
import prismaActions from "./prisma.actions";

class PrismaService {
	async guildUsersScan(guilds: Guild[]) {
		console.log("scanning for new users");
		guilds.forEach(async (guild) => {
			let users = await guild?.members.fetch();
			let count = 0;

			users.forEach(async (userMebmer) => {
				if ((await prismaActions.getUser(userMebmer.id)) === null) {
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

		if ((await prismaActions.getUser(id)) === null) {
			console.log(`adding new user ${guildMember.user.username}`);
			prismaActions.addUser(guildMember);
		}
	}

	async guildRolesScan(guildManager: GuildManager) {
		console.log("scanning for new roles");
		guildManager.cache.map(async (guild) => {
			let roles = guild?.roles.cache.map((role) => role);
			let count = 0;

			roles.forEach(async (role) => {
				if ((await prismaActions.getRole(role.id)) === null) {
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

	async addNewGuild(guild: Guild) {
		if ((await prismaActions.getGuild(guild.id)) === null) prismaActions.addGuild(guild);
	}

	async addNewChannels(guild: Guild) {
		const channels = await guild.channels.fetch();

		channels.map(async (channel) => {
			if (channel)
				if ((await prismaActions.getChannel(channel.id)) === null) {
					await prismaActions.addChannel(channel);
				}
		});
	}

	async addNewMembers(guild: Guild) {
		const members = await guild.members.fetch();
		members.map(async (member) => {
			if ((await prismaActions.getMember(member.guild.id, member.id)) === null) {
				await prismaActions.addMember(member);
			}
		});
	}
}

export default new PrismaService();
