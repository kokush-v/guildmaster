interface InitPanelProps {
   title: string;
   placeholder: string;
}

export default function DataInit({ title, placeholder }: InitPanelProps) {
   return (
      <div className="token-container flex flex-col items-center">
         <h1 className="text-white my-16">{title}</h1>
         <div className="form__group field">
            <input
               type="input"
               className="form__field"
               placeholder="Name"
               name="name"
               id="name"
               required
            />
            <label htmlFor="name" className="form__label">
               {placeholder}
            </label>
         </div>
      </div>
   );
}
