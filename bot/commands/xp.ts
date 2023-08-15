import { Message } from "discord.js";

export function xpHandler(msg: Message) {
	msg.channel.send("You have 0 xp");
}
