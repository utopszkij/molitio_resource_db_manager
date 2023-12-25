'use client'
import { getCookie } from 'cookies-next';

type SetCookiesParam = {
    name: string,
    value: any
} 

/**
 * cookie managment with check cokkieConsent 
 * WORNING! can use this object only event handler!
 * notes: cokies-next setCookie function is generate 'SameSite' error into browser console
 */
export const Cookies = {
    /**
     * set one cookie value
     * set cookie if cokkie consent enabled in cookie category (cokkie name: 'category_name')
     * except "work_checked, "work_work_enabled" cookies, these two are always stored.
     * @param name // cookie name
     * @param value // cookie value
     * @param expireDays // expire days, default: 500 day
     */
    setCookie: (name:string, value:any, expireDays?: number) => {
    
        // enabled use this cookie'category?    
        let enabled = true;
        const cookieCategory = name.split('_')[0];
        if ((name != 'work_work_enabled') && (name != 'work_checked')) {
            enabled = (getCookie('work_'+cookieCategory+'_enabled') == 'true');
        }
        if (enabled) {
            let d = new Date();
            if (expireDays !== undefined) {
                d.setTime(d.getTime() + (expireDays*24*60*60*1000));
            } else {
                d.setTime(d.getTime() + (500*24*60*60*1000));
            }
            const expires = d.toUTCString();
            document.cookie = name+'='+String(value)+'; path=/; expires='+expires+'; SameSite=Lax'; 
        }   
        

    },

    /**
     * set many cookies
     * set cookie if cokkie consent enabled in cookie category (cokkie name: 'category_name')
     * except "work_checked, "work_work_enabled" cookies, these two are always stored.
     * @param params // [{name:'xx', value:yy},...]
     */
    setCookies: (params: Array<SetCookiesParam>) => {
        let key:any = 0;
        for (key in params) {
            Cookies.setCookie(params[key].name, params[key].value);
        }
    },

    /**
     * 
     * @param name get one cookie value
     * @returns 
     */
    getCookie: (name:string):string => {
        return String(getCookie(name));
    }
}
