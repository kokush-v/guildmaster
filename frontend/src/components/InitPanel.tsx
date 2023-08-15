import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "framer-motion";
import TokenInit from "../ui-elements/DataInit";

import "../styles/init-panel.scss";

const variants = {
   enter: (direction: number) => {
      return {
         x: direction > 0 ? 1000 : -1000,
         opacity: 0,
      };
   },
   center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
   },
};

export default function InitPanel() {
   const [[page, direction], setPage] = useState([0, 0]);
   const divArray = [
      <TokenInit title="Write your bot token" placeholder="BotToken" />,
      <TokenInit title="Write URL for PostgresDB" placeholder="URL" />,
   ];
   const sliderIndex = wrap(0, divArray.length, page);

   const paginate = (newDirection: number) => {
      setPage([page + newDirection, newDirection]);
   };

   return (
      <div className="absolute w-screen h-screen bg-zinc-500 flex justify-center items-center">
         <div className="panel-wrapper">
            <div className="slider-wrapper">
               <div className="flex justify-center items-center">
                  <AnimatePresence initial={false} custom={direction}>
                     <motion.div
                        key={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                           x: { type: "spring", stiffness: 400, damping: 20 },
                           opacity: { duration: 0.2 },
                        }}
                     >
                        {divArray[sliderIndex]}
                     </motion.div>
                  </AnimatePresence>
               </div>
            </div>
            <div className="w-1/2 flex justify-around m-8">
               {sliderIndex > 0 && (
                  <span
                     className="prev"
                     onClick={() => {
                        paginate(-1);
                     }}
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        className="w-10 h-10"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z"
                        />
                     </svg>
                  </span>
               )}
               {sliderIndex < divArray.length - 1 ? (
                  <span
                     className="next"
                     onClick={() => {
                        paginate(1);
                     }}
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        className="w-10 h-10"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
                        />
                     </svg>
                  </span>
               ) : (
                  <input type="button" value="Submit" />
               )}
            </div>
         </div>
      </div>
   );
}
