import { Guild, GuildMember, User } from "discord.js";
import prismaActions from "../prisma.actions";

class UserService {
	async scan(guilds: Guild[]) {
		console.log("scanning for users");
		guilds.forEach(async (guild) => {
			let users = await guild?.members.fetch();

			users.forEach(async (userMebmer) => {
				prismaActions.upsertUser(userMebmer);
			});
		});
		console.log("scanning for users finished");
	}

	async addNewUser(guildMember: GuildMember) {
		console.log(`adding new user ${guildMember.user.username}`);
		prismaActions.upsertUser(guildMember);
	}

	async updateUser(user: User) {
		const getUser = await prismaActions.getUser(user.id);
		if (getUser) {
			await prismaActions.updateUser(user);
		}
	}
}

export default new UserService();
