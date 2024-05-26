import { configureStore } from "@reduxjs/toolkit";
import atsSlice from './slice/atsSlice'
import ackSlice from "./slice/ackSlice";
import transportSlice from "./slice/transportSlice";
import transcrossingSLice from "./slice/transSlice";
import bytransSlice from "./slice/bytransSlice";
import byvmatSlice from "./slice/byvmatSlice";
import byTwoPaySlice from './slice/bytwopaySlice'
export const Store = configureStore({
    reducer: { 
        ats: atsSlice, 
        ack: ackSlice, 
        truck: transportSlice, 
        trans: transcrossingSLice,
        bytrans : bytransSlice,
        byvmat : byvmatSlice,
        bytwopay : byTwoPaySlice
    }
})

export type AppDispatch = typeof Store.dispatch