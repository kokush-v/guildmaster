export default function Header() {
   return (
      <header className="flex justify-between  items-center h-20 border-b border-gray-600 px-40 font-bold">
         <h1 className="text-2xl">
            Guild
            <b className="bg-slate-500 text-white p-1 m-1 rounded-md font-thin">
               Master<b className="text-red-400">.v1</b>
            </b>
         </h1>
         <div className="w-2/3 flex justify-around items-center text-xl">
            <a href="#">About</a>
            <a href="#">Documentation</a>
            <a href="#">API</a>
         </div>
         <span className="w-14 h-14 cursor-pointer">
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
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
               />
            </svg>
         </span>
      </header>
   );
}
