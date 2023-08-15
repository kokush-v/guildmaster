import axios from "axios";
import { IModule } from "../src/types";

class BotModuleController {
	private baseUrl: string = "http://127.0.0.1:8080/api/v1";
	async fetchModules(): Promise<IModule[]> {
		const resp = await axios.get(`${this.baseUrl}/modules`);
		const data = resp.data.modules;

		return data;
	}
}

export default new BotModuleController();
