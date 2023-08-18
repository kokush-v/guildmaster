import { DiscordUsers, PrismaClient } from "@prisma/client";
import { GuildMember, User } from "discord.js";

const prisma = new PrismaClient();

class PrismaActions {
	async getAllUsers() {
		try {
			const users = prisma.discordUsers.findMany();
			await prisma.$disconnect();
			return users;
		} catch (error) {
			console.error(error);
			await prisma.$disconnect();
			return null;
		}
	}

	async addUser({ id, username }: User) {
		await prisma.discordUsers.create({
			data: {
				id: id,
				username: username,
			},
		});
	}

	async getUser(id: string): Promise<DiscordUsers> {
		return await prisma.discordUsers.findUniqueOrThrow({ where: { id: id } });
	}
}

export default new PrismaActions();
