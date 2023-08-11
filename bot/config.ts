require("dotenv").config();

class BotConfig {
	BOT_TOKEN = process.env.BOT_TOKEN;
	DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
	prefix = "!";
}

let botConfig = new BotConfig();

if (!botConfig.BOT_TOKEN || !botConfig.DISCORD_CLIENT_ID) {
	throw new Error("Missing environment variables");
}

export default botConfig;
