import { useEffect, useState } from 'react';
import { useAppDispatch } from "../store/hooks/redux";
import { botSlice } from "../store/reducers/BotSlice";
import { IBot, } from "../types";
import ControlPanel from "./ControlPanel";
import SidePanel from "./SidePanel";
import BotModuleController from "../../controllers/bot.module.controller"

export default function BotsMainPanel() {

	const [bots, setBots] = useState<IBot[]>([]);

	useEffect(() => {
		setBots([
			{
				id: 1,
				name: "GuildMaster",
				imgUrl: "https://discordbotlist.com/icon.png",
				status: true,
				modules: []
			}
		])
	}, [])

	useEffect(() => {
		const fetchModules = async () => {
			const data = await BotModuleController.fetchModules()
			bots[0].modules = data
			dispatch(set(bots[0]))
		}

		fetchModules()
	})

	const { set } = botSlice.actions;
	const dispatch = useAppDispatch();



	return (
		<div className="flex  w-full h-full">
			<SidePanel bots={bots} />
			<ControlPanel />
		</div>
	);
}
