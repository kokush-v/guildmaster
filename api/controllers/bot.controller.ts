import { Request, Response } from "express";
import botService from "../services/bot.service";

class BotController {
	async getBotName(req: Request, res: Response) {
		try {
			const botName = await botService.getBotName();

			res.json({
				"bot-name": botName,
			});
		} catch (e) {
			console.log(e);
			res.status(400).send(e);
		}
	}
}

export default new BotController();
