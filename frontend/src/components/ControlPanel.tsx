import { useAppSelector } from "../store/hooks/redux";
import BotPanel from "./bots-templ/BotPanel";

export default function ControlPanel() {
   var { bot } = useAppSelector((state) => state.botReducer);

   return (
      <div className="cntrl-p-header px-10 py-5">
         <BotPanel
            id={bot.id}
            name={bot.name}
            imgUrl={bot.imgUrl}
            status={bot.status}
            modules={bot.modules}
         />
      </div>
   );
}
