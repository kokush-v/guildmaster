import { Users, PrismaClient } from "@prisma/client";
import { User } from "discord.js";

const prisma = new PrismaClient();

class PrismaActions {
	async getAllUsers() {
		try {
			const users = prisma.users.findMany();
			await prisma.$disconnect();
			return users;
		} catch (error) {
			console.error(error);
			await prisma.$disconnect();
			return null;
		}
	}

	async addUser({ id, username }: User) {
		await prisma.users.create({
			data: {
				id: id,
				username: username,
			},
		});
	}

	async getUser(id: string): Promise<Users | null> {
		return await prisma.users.findUnique({ where: { id: id } });
	}
}

export default new PrismaActions();
