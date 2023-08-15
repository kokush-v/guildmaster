import { Message } from "discord.js";
import botConfig from "../config";
import { Commands } from "./commnds";
import { pingHandler } from "./ping";
import { xpHandler } from "./xp";
import { bankHandler } from "./banking";
import { clubHandler } from "./clubs";

const handleCommands = async (msg: Message) => {
	let startTime = performance.now();
	let message = msg.content;

	if (msg.author.bot) return;

	if (message.startsWith(botConfig.prefix)) {
		switch (message.slice(1)) {
			case Commands.Ping:
				pingHandler(msg, startTime);
				break;
			case Commands.Xp:
				xpHandler(msg);
				break;
			case Commands.Banking:
				bankHandler(msg);
				break;
			case Commands.Clubs:
				clubHandler(msg);
				break;
		}
	}
};

export default handleCommands;
