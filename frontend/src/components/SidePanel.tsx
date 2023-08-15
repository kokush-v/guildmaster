import { useAppDispatch } from "../store/hooks/redux";
import { botSlice } from "../store/reducers/BotSlice";
import { IBot } from "../types";
import BotSmall from "./bots-templ/BotSmall";

interface SidePanelProps {
   bots: IBot[];
}

export default function SidePanel({ bots }: SidePanelProps) {
   const { set } = botSlice.actions;
   const dispatch = useAppDispatch();

   return (
      <div className="bots">
         <h1 className="w-full text-3xl my-9 text-center">Available bots</h1>
         <div className="bots-wrapper border-t border-gray-600">
            {bots.map(({ id, name, imgUrl, status, modules }, index) => {
               return (
                  <div key={index}
                     onClick={() => {
                        dispatch(set(bots[index]));
                     }}>
                     <BotSmall
                        id={id}
                        name={name}
                        imgUrl={imgUrl}
                        status={status}
                        modules={modules}
                     />
                  </div>
               );
            })}
         </div>
      </div>
   );
}
