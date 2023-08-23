import { GuildMember, Guild } from "discord.js";
import prismaActions from "../prisma.actions";

class MemberRoleService {
	async scan(guilds: Guild[]) {
		console.log("scanning for new role members");
		guilds.forEach(async (guild) => {
			let users = await guild?.members.fetch();
			let count = 0;

			users.forEach(async (userMebmer) => {
				count++;
				prismaActions.upsertUser(userMebmer);
			});
		});
		console.log("scanning for role members finished");
	}

	async checkRoleMembers(newMember: GuildMember, oldMember: GuildMember) {
		const addedRoles = newMember.roles.cache.filter((role) => !oldMember.roles.cache.has(role.id));
		const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));

		if (addedRoles.size > 0) {
			addedRoles.forEach((role) => {
				this.addNewRoleMember(role.id, newMember.id);
			});
		}

		if (removedRoles.size > 0) {
			removedRoles.forEach((role) => {
				this.removeRoleMember(role.id, newMember.id);
			});
		}
	}

	async addNewRoleMember(roleId: string, memberId: string) {
		if (!(await prismaActions.getRoleMember(roleId, memberId))) {
			prismaActions.addRoleMember(roleId, memberId);
		}
	}
	async removeRoleMember(roleId: string, memberId: string) {
		const roleMember = await prismaActions.getRoleMember(roleId, memberId);
		if (roleMember) prismaActions.removeRoleMember(roleMember.id);
	}
}

export default new MemberRoleService();
