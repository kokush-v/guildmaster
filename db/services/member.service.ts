import { Guild, GuildBan, GuildMember } from "discord.js";
import prismaActions from "../prisma.actions";

class MembersService {
	async scan(guilds: Guild[]) {
		console.log("scanning for members");

		guilds.forEach(async (guild) => {
			const members = await guild.members.fetch();
			members.map(async (member) => {
				let id: number = -1;

				await prismaActions.getMember(member.guild.id, member.id).then((member) => {
					if (id) id = member?.id as number;
				});

				prismaActions.upsertMember(member, id);
			});
		});

		console.log("scanning for members finished");
	}

	async addNewMember(member: GuildMember) {
		let id: number = -1;

		await prismaActions.getMember(member.guild.id, member.id).then((member) => {
			if (id) id = member?.id as number;
		});

		prismaActions.upsertMember(member, id);
	}

	async updateMember(member: GuildMember) {
		const getUser = await prismaActions.getMember(member.guild.id, member.id);
		if (getUser) {
			prismaActions.updateMember(getUser.id, member);
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

export default new MembersService();
