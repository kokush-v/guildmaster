import client from "../../bot";

class BotService {
	async getBotName(): Promise<String> {
		return client.user?.username as string;
	}
}

export default new BotService();
