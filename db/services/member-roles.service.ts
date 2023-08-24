import { Guild, GuildMember } from "discord.js";
import prismaActions from "../prisma.actions";

class MemberRoleService {
	async scan(guilds: Guild[]) {
		console.log("scanning for new role members");
		guilds.forEach(async (guild) => {
			let members = await guild?.members.fetch();
			members.forEach((member) => {
				member.roles.cache.forEach(async (role) => {
					let id: number = -1;

					await prismaActions.getRoleMember(role.id, member.id).then((roleMember) => {
						if (roleMember?.id) id = roleMember?.id as number;
					});
					prismaActions.addRoleMember(id, role.id, member.id);
				});
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
		let id: number = -1;

		await prismaActions.getRoleMember(roleId, memberId).then((roleMember) => {
			if (roleMember?.id) id = roleMember?.id as number;
		});
		prismaActions.addRoleMember(id, roleId, memberId);
	}
	async removeRoleMember(roleId: string, memberId: string) {
		const roleMember = await prismaActions.getRoleMember(roleId, memberId);
		if (roleMember) prismaActions.removeRoleMember(roleMember.id);
	}
}

export default new MemberRoleService();
