import { IBot } from "../../types";

export default function BotSmall({ id, name, imgUrl, status }: IBot) {
   return (
      <div
         className={
            "bot-small flex items-center justify-around " +
            (status ? "online" : "offline")
         }
         id={id.toString()}
      >
         <img className="bot-avatar rounded-full w-14" src={imgUrl} alt="" />

         <h1>{name}</h1>
      </div>
   );
}
