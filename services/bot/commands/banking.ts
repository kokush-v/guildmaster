import { Message } from "discord.js";

export function bankHandler(msg: Message) {
	msg.channel.send("You have 0 coins");
}
