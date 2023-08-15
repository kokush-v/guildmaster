import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { IBot } from '../../types'

interface BotState{
    bot: IBot
    err: string
}

const initialState: BotState = {
    bot: <IBot>{},
    err: ""
}


export const botSlice = createSlice({
    name: "bot",
    initialState,
    reducers:{
        set(state, action:PayloadAction<IBot>){
            state.bot = action.payload
        }
    }
})

export default botSlice.reducer