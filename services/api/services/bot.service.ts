import bot from "../../bot/bot";

class BotService {
	async getBotName(): Promise<String> {
		return bot.client.user?.username as string;
	}
}

export default new BotService();
