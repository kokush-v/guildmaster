import { Guild, GuildMember, Role } from "discord.js";
import prismaActions from "../prisma.actions";

class RolesService {
	async scan(guilds: Guild[]) {
		console.log("scanning for new roles");
		guilds.map(async (guild) => {
			let roles = guild?.roles.cache.map((role) => role);

			roles.forEach(async (role) => {
				if (!(await prismaActions.getRole(role.id))) {
					if (role.name === "@everyone") return;
					prismaActions.upsertRole(role);
				}
			});
		});
		console.log("scanning for roles finished");
	}

	async setOldRoles(member: GuildMember) {
		const roles = await prismaActions.getOldRoles(member.id);
		roles.forEach((elem) => {
			const role = member.guild.roles.cache.get(elem.roles_id as string);
			console.log(role?.name);
			if (role) member.roles.add(role);
		});
	}

	async addNewRole(role: Role) {
		prismaActions.upsertRole(role);
	}

	async removeRole(role: Role) {
		if (await prismaActions.getRole(role.id)) prismaActions.removeRole(role);
	}
}

export default new RolesService();
