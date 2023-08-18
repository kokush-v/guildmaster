import { Guild, GuildMember, User } from "discord.js";
import prismaActions from "./prisma.actions";
import { DiscordUsers } from "@prisma/client";

class PrismaService {
	async guildMembersScan(guild: Guild) {
		console.log("scanning for new users");

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
	}

	async addNewUser(user: User): Promise<DiscordUsers | undefined> {
		try {
			let dbUsers = await prismaActions.getAllUsers();
			if (!dbUsers?.some((dbuser) => dbuser.id.toString() === user.id)) {
				console.log(`adding new user ${user.username}`);
				prismaActions.addUser(user);

				return await prismaActions.getUser(user.id);
			}
		} catch (e) {
			console.log(e);
			return undefined;
		}
	}
}

export default new PrismaService();
