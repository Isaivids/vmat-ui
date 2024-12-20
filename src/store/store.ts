import { configureStore } from "@reduxjs/toolkit";
import atsSlice from './slice/atsSlice'
import ackSlice from "./slice/ackSlice";
import transportSlice from "./slice/transportSlice";
import transcrossingSLice from "./slice/transSlice";
import bytransSlice from "./slice/bytransSlice";
import byvmatSlice from "./slice/byvmatSlice";
import byTwoPaySlice from './slice/bytwopaySlice'
import searchSlice from "./slice/searchSlice";
import userSlice from "./slice/userSlice";
import ccptoSlice from "./slice/ccptoSlice";
import tcpSlice from "./slice/tcpSlice";
import truckSlice from "./slice/truckSlice";
import transportadvanceSlice from "./slice/transportadvance";
import vmatAccountSLice from "./slice/vmataccount";
import bankDetailSlice from "./slice/bankSlice";
import courierSllce from "./slice/courierSlice";
import billSlice from "./slice/billSlice";
import sugSlice from './slice/suggesstions'
export const Store:any = configureStore({
    reducer: { 
        ats: atsSlice, 
        ack: ackSlice, 
        truck: truckSlice,
        transport : transportSlice, 
        trans: transcrossingSLice,
        bytrans : bytransSlice,
        byvmat : byvmatSlice,
        bytwopay : byTwoPaySlice,
        search : searchSlice,
        user : userSlice,
        ccpto : ccptoSlice,
        tcp : tcpSlice,
        transportadvance : transportadvanceSlice,
        vmat : vmatAccountSLice,
        bank : bankDetailSlice,
        courier : courierSllce,
        bill : billSlice,
        sug : sugSlice,
    }
})

export type AppDispatch = typeof Store.dispatch