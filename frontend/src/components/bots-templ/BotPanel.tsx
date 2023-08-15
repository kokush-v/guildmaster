import { useEffect, useState } from 'react';
import { IBot, IModule } from "../../types";

export default function BotPanel({ id, name, imgUrl, status, modules }: IBot) {

   const [modulesState, setModulesState] = useState<IModule[]>([])

   useEffect(() => {
      setModulesState(modules)
   }, [modules])

   const changeAutoRun = (id: string) => console.log(id);

   return (
      <div>
         <div
            className={
               "bot-big flex items-center justify-around " +
               (status ? "online" : "offline")
            }
            id={id?.toString()}
         >
            <img className="bot-avatar rounded-full w-20" src={imgUrl} alt="" />

            <h1>{name}</h1>
         </div>
         <div className="modules-wrapper">
            {modulesState?.map(({ id, prefix, name, description, enabled, active }, index) => {
               return (
                  <div className="module" key={index} >
                     <h1>{name}</h1>
                     <p>{description}</p>
                     <p>Prefix: {prefix}</p>
                     <span className='flex items-center gap-5' onClick={() => changeAutoRun(id)}>
                        <div className="toggle-pill-color">
                           <input type="checkbox" id="pill3" name="check" checked={enabled} />
                           <label htmlFor="pill3"></label>
                        </div>
                        <p>Autorun</p>
                     </span>
                     <h2>
                        Status:{" "}
                        <b className={active ? "started" : "stopped"}>
                           {active ? "STARTED" : "STOPPED"}
                        </b>
                     </h2>
                     <div className="control-buttons">
                        <svg
                           stroke="currentColor"
                           strokeWidth={1.5}
                           viewBox="0 0 24 24"
                           xmlns="http://www.w3.org/2000/svg"
                           aria-hidden="true"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                           />
                        </svg>
                        <svg
                           fill="none"
                           stroke="currentColor"
                           strokeWidth={1.5}
                           viewBox="0 0 24 24"
                           xmlns="http://www.w3.org/2000/svg"
                           aria-hidden="true"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                           />
                        </svg>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
}
