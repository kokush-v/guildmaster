import { Message } from "discord.js";

export function pingCommand(msg: Message) {
	msg.channel.send("Pong");
}
