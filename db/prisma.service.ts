import { Guild, User } from "discord.js";
import prismaActions from "./prisma.actions";
import { Users } from "@prisma/client";

class PrismaService {
	async guildMembersScan(guilds: Guild[]) {
		console.log("scanning for new users");
		guilds.forEach(async (guild) => {
			let users = await guild?.members.fetch();
			let dbUsers = await prismaActions.getAllUsers();
			let count = 0;

			users.forEach(({ user }) => {
				if (!dbUsers?.some((dbuser) => dbuser.id.toString() === user.id)) {
					console.log(`adding new user ${user.username}`);
					count++;
					prismaActions.addUser(user);
				}
			});

			if (count > 0) {
				console.log(`added ${count} new users`);
			} else {
				console.log("no new users");
			}
		});
	}

	async addNewUser(user: User): Promise<Users | null> {
		let dbUsers = await prismaActions.getAllUsers();
		if (!dbUsers?.some((dbuser) => dbuser.id.toString() === user.id)) {
			console.log(`adding new user ${user.username}`);
			prismaActions.addUser(user);
		}
		return await prismaActions.getUser(user.id);
	}
}

export default new PrismaService();
