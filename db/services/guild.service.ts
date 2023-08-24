import { Guild } from "discord.js";
import prismaActions from "../prisma.actions";

class GuildService {
	async scan(guilds: Guild[]) {
		console.log("scanning for guilds");

		guilds.forEach((guild) => this.addNewGuild(guild));

		console.log("scanning for roles guilds");
	}

	async addNewGuild(guild: Guild) {
		prismaActions.upsertGuild(guild);
	}

	async removeGuild(guild: Guild) {
		if (await prismaActions.getGuild(guild.id)) prismaActions.removeGuild(guild);
	}
}

export default new GuildService();
