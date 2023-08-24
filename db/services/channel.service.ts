import { Guild, Channel } from "discord.js";
import prismaActions from "../prisma.actions";
import { channels } from "@prisma/client";

class ChannelService {
	async scan(guilds: Guild[]) {
		console.log("scanning for channels");

		guilds.forEach(async (guild) => {
			const channels = await guild.channels.fetch();

			channels.map(async (channel) => {
				if (channel) prismaActions.upsertChannel(channel);
			});
		});

		console.log("scanning for channels finished");
	}

	async addNewChannel(channel: Channel) {
		prismaActions.upsertChannel(channel);
	}

	async removeChannel(channel: Channel) {
		if (await prismaActions.getChannel(channel.id)) {
			await prismaActions.removeChannel(channel);
		}
	}
}

export default new ChannelService();
