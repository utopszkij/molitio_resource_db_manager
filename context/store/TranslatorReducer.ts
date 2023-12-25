/**
 * Human language translator width REDUX system
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TranslatorStoreStateType, DictionaryType } from '../types';
import { Cookies } from '../../components/CookieConsent/Cookies';

let initialState: TranslatorStoreStateType = {
    translator: {
        lng: '',
        dictionaries: [
            {name:'', position:0, items:{}, loaded:false},
            {name:'', position:1, items:{}, loaded:false}
        ]
    }
}  

const translatorSlice = createSlice({
    name: 'transalator',
    initialState,
    reducers: {
        setDictionary:  (state, action: PayloadAction<DictionaryType>) => {
            const dictionary: DictionaryType = action.payload;
            const key = dictionary.position;
            state.translator.dictionaries[key].items = dictionary.items;
            state.translator.dictionaries[key].loaded = true;
        },    
        setLng: (state, action:PayloadAction<string>) => {
            state.translator.lng = action.payload;
            let key = 0;
            for (key = 0; key < state.translator.dictionaries.length; key++) {
                state.translator.dictionaries[key].loaded = false;
            }
            Cookies.setCookie('customize_lng',state.translator.lng);
        }    
    }
});        


export const translatorReducer = translatorSlice.reducer;
export const { setLng } = translatorSlice.actions;
export const { setDictionary } = translatorSlice.actions;

