/**
 * Cookie consent manager by REDUX system
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CookieConsentStoreState, CookieConsentData } from '../types';
import { Cookies } from '../../components/CookieConsent/Cookies';

let initialState: CookieConsentStoreState = {
    cookieConsent: {
        checked: true,
        workEnabled: false,
        statisticEnabled: false,
        marketEnabled: false,
        customizeEnabled: false
    }
}  
// note: The CookieConsent form onLoad event handler owerwrite this data from cookies  

const cookieConsentSlice = createSlice({
    name: 'cookieConsent',
    initialState,
    reducers: {
        setCookieConsentData: (state, action: PayloadAction<CookieConsentData>) => {
            state.cookieConsent = action.payload;
            Cookies.setCookies([
                {name:'work_checked', value:state.cookieConsent.checked },
                {name:'work_work_enabled', value:state.cookieConsent.workEnabled },
                {name:'work_statistic_enabled', value:state.cookieConsent.statisticEnabled },
                {name:'work_market_enabled', value:state.cookieConsent.marketEnabled},
                {name:'work_customize_enabled', value:state.cookieConsent.customizeEnabled},
            ])
        },
        setCookieConsentChecked: (state, action: PayloadAction<boolean>) => {
            state.cookieConsent.checked = action.payload;
            if (window != undefined) {
                Cookies.setCookie('work_checked',String(state.cookieConsent.checked));
            }    
        },
    },
});

export const cookieConsentReducer = cookieConsentSlice.reducer;
export const { setCookieConsentData } = cookieConsentSlice.actions;
export const { setCookieConsentChecked } = cookieConsentSlice.actions;

