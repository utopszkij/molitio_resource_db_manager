import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authReducer } from './AuthReducer';
import { cookieConsentReducer } from './CookieConsentReducer';
import { translatorReducer } from './TranslatorReducer';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux"

const rootReducer = combineReducers({
    auth: authReducer,
    cookieConsent: cookieConsentReducer,
    translator: translatorReducer
});

export const appStore = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppContextStoreDispatch = typeof appStore.dispatch;

type AppDispatch = typeof appStore.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const selectCookieConsentData = (state: RootState) => state.cookieConsent.cookieConsent;
export const selectTranslatorData = (state: RootState) => state.translator.translator;
//+ 2023.12.13 Utopszkij
export const selectAuthData = (state: RootState) => state.auth.user;
//+ 2023.12.13 Utopszkij
