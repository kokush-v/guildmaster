import { Guild } from "discord.js";
import prismaActions from "../prisma.actions";
import { guilds } from "@prisma/client";

class GuildService {
	async scan(guilds: Guild[]) {
		console.log("scanning for guilds");

		guilds.forEach((guild) => this.addNewGuild);

		console.log("scanning for roles guilds");
	}

	async addNewGuild(guild: Guild): Promise<guilds | null> {
		await prismaActions.upsertGuild(guild);
		return await prismaActions.getGuild(guild.id);
	}

	async removeGuild(guild: Guild) {
		if (await prismaActions.getGuild(guild.id)) prismaActions.removeGuild(guild);
	}
}

export default new GuildService();
