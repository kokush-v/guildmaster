import { Message } from "discord.js";
import botConfig from "../config";
import { pingCommand } from "./ping";

const handleCommands = async (msg: Message) => {
	let message = msg.content;

	if (msg.author.bot) return;

	if (message.startsWith(botConfig.prefix)) {
		switch (message.slice(1)) {
			case "ping":
				pingCommand(msg);
				break;
		}
	}
};

export default handleCommands;
