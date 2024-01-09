'use client';
/**
 * Form manager support object
 */ 
import { Cookies } from '../../components/CookieConsent';

type SetFormDataField = (fname: string, value: any) => void;
export type BrowserInfo = {
    name: string,
    filter: Array<any>,
    limit: number,
    offset:number,
    order:string,
    paginatorSize:number  // count of paginato items in left and right from actual page
};


export const fm =  {
    setFormDataField: (fname:string, value: any):void => {},
    
    init: (f: SetFormDataField) => {
        fm.setFormDataField = f;
    },
    
    /**
     * initialized browser info 
     */
    browserInfo0: {
        name:'',
        filter: [],
        offset:0,
        order:'name: asc',
        limit:10,
        paginatorSize:10
    },


    /**
     * get cookie with default value
     * @param name 
     * @param def 
     * @returns 
     */
    getCookie: (name:string, def:any) => {
        const w = Cookies.getCookie(name);
        if (w == undefined) {
            return def;
        } else {
            return w;
        }
    },    

    /**
     * get browser info from cookie
     * @param browserName
     * @returns BrowserInfo
     */
    getBrowserInfo: (name: string) => {
        const s = fm.getCookie('work_browser_'+name,'');
        let result: BrowserInfo = {
            name:name,
            filter: [],
            offset:0,
            order:'name: asc',
            limit:10,
            paginatorSize:10
        };
        if (s >= '{') {
            result = JSON.parse(s);
        }    
        result.paginatorSize = (window.innerWidth - 200) / 90;
        if (window.innerHeight > 800) {
            result.limit = 10;
        } else {
            result.limit = 5;
        }
        return result;
    },
    
    /**
     * save BrowserInfo to cookie
     * @param browserInfo 
     */
    saveBrowserInfo: (browserInfo: BrowserInfo) => {
        Cookies.setCookie('work_browser_'+browserInfo.name, JSON.stringify(browserInfo));
    },

    /**
     * get value from DOM event handler
     * @param e  INPUT | TEXTAREA | SELECT onVhange event
     * @returns mixed
     */
    getValueFromEvent: (e:any) => {
        let nodeName = e.target.nodeName;
        let fieldValue: any = '';
        if (nodeName == 'INPUT') {
            let type = e.target.type;
            if (type == 'checkbox') {
                fieldValue = e.target.checked;
            } else if ((type == 'radio')) {
                fieldValue = e.target.selected;
            } else {
                fieldValue = e.target.value;
            }
        }
        if (nodeName == 'SELECT') {
            fieldValue = e.target.options[e.target.selectedIndex].value;
        }
        if (nodeName == 'TEXTAREA') {
            fieldValue = e.target.value;
        }
        return fieldValue;
    },

    /**
     * form change event handler
     * @param e 
     */
    handleInput: (e:any)=> {
        const fieldValue = fm.getValueFromEvent(e);
        fm.setFormDataField(e.target.id, fieldValue);
    },

    /**
     * show errorMsg in popup
     * @param msg 
     */
    setErrorMsg: (msg: string) => {
        fm.setFormDataField('successMsg', '');
        fm.setFormDataField('errorMsg', msg);
    },

    /**
     * show successMsg in popup
     * @param msg 
     */
    setSuccessMsg: (msg: string) => {
        fm.setFormDataField('errorMsg', '');
        fm.setFormDataField('successMsg', msg);
    },

    /**
     * clear succesMsg and errorMsg 
     */
    clearMsgs: () => {
        fm.setSuccessMsg('');
        fm.setErrorMsg('');
    },

    /**
     * valid/invalid marker to form
     * @param fieldName 
     * @param valid 
     */
    validMarker: (fieldName:string, valid: boolean) => {
        if (valid) {
            document.getElementById(fieldName)?.setAttribute('class','');
        } else {
            document.getElementById(fieldName)?.setAttribute('class','alert_danger');
            document.getElementById(fieldName)?.focus();
        }
    },

    /**
     * get current date
     * @returns string
     */
    getCurrentDate: () => {
        const d = new Date();
        return d.getFullYear()+'-'+(1+d.getMonth())+'-'+d.getDate();
    },

    // test user data, must overwrite it!
    testUser : {
            id:"f67714ca-0138-4b77-be88-28f36ecf026b",
            accessToken:'',
            fullname:'',
            email:'', 
            nick:"admin",
            avatar:"noavatar.png",
            roles:[""]
    },

    /**
     * 
     * @returns get logged user  TEST VERSION !!!!!!
     */
    getCurrentUser: () => {
        let result = fm.testUser;
        const s = Cookies.getCookie('work_loged');
        if (s >= '{') {
            result =  JSON.parse(s);
        }
        return result;
    } 
    
}
