import { Message } from "discord.js";
import { performance } from "perf_hooks";

export async function pingHandler(msg: Message, startTime: number) {
	let time = performance.now() - startTime;
	msg.channel.send(`Pong\n*${time.toFixed(3)} ms*`);
}
