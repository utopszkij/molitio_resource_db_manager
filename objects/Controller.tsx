'use client';
import { t } from '../components/Translator';    
import { preprocessor} from './DatabaseInterface';
import { BrowserInfo, fm } from './FormManager';
import { Paginator } from './Paginator';
import { Model, Record } from './Model';

/**
 * formData objektum
 * always to be rewritten
 */
export type FormData = {
    compStatus: string,
    // messages
    errorMsg: string,
    successMsg: string,
    // data form
    id: string,
    //name: string,
    //description: string,
    //status: string,
    created_by: string,
    creatorName: string,
    created_at: string,
    updated_by: string,
    updaterName: string,
    updated_at: string,
    // filter form
    //filterName: string,
    //filterDescription: string,
    //filterStatus: string,
    // browser
    offset:number,
    order:string,
    total:number,
    items: never[],
    pages: never[]
}

/**
 * set one formData field value function
 */
type SetFormDataField = (name:string, value:any) => void;
type GetFormData = () => FormData;

/**
 * Controller class
 * WARNING!  
 * - Must call first the onLoad function
 * - The getFormData function must be redefined for each formData change
 */
export class Controller {
    id: string = '';
    browserInfo: BrowserInfo;
    browserName: string;
    user:any = {};
    setFormDataField = (name:string, value:any) => {};
    getFormData: GetFormData|any = () => {return {}};
    model;

    /**
     * setup controller 
     * always to be rewritten 
     */
    constructor() {
        this.browserInfo = fm.browserInfo0;
        this.browserName = 'communities';
        this.user = fm.getCurrentUser();
        this.model = new Model();   // always to be rewritten!
    }

    waiting(show:boolean) {
        const w = document.getElementById('waiting');
        if (w != undefined) {
            if (show) {
                w.innerHTML = 
                '<div style="position:fixed; top:300px;width:100%; z-index:10; color:red; text-align:cnter; opacity:1">'+
                '<img src="/img/waiting_lg.gif" />'+
                '<div>';
            } else {
                w.innerHTML = '';
            }
        }
    }

    /**
    * always to be rewritten 
    */ 
    onLoad(id: string, setFormDataField:SetFormDataField, getFormData: GetFormData) {
        this.id = id;
        this.setFormDataField = setFormDataField;
        this.getFormData = getFormData;
        let i = 0;
        let filterField = '';
        if (this.id == '0') {
            // set filterForm field from browserInfo
            for(i = 0; i < this.browserInfo.filter.length; i++) {
                filterField = this.browserInfo.filter[i].relation.fieldName;
                if ((filterField == 'name') ||
                    (filterField == 'description') ||
                    (filterField == 'staus')) {
                    filterField = filterField.substring(0,1).toUpperCase() +
                                filterField.substring(1,100);  
                    this.setFormDataField('filter'+filterField, 
                        this.browserInfo.filter[i].realtion.value);    
                }   
            }
            this.getItems('browser');
        }
        if (this.id != '0') {
            this.browserInfo.filter = [];
            this.getOneRecord(this.id, 'show');
        }

    }

    /**
     * get records from database, call getTotalCount
     * @param newStatus 
     * @param newOffset 
     */
    getItems(newStatus: string, newOffset?:number) {
        let formData: FormData = this.getFormData();
        window?.scrollTo(0,0);
        this.waiting(true);
        if (newOffset != undefined) {
            if (newOffset < 0) newOffset = 0;
            if (newOffset >= formData.total) newOffset = 0;
            this.browserInfo.offset = newOffset;
            this.setFormDataField('offset',newOffset);
        }
        this.setFormDataField('order', this.browserInfo.order);
        this.model.getRecords(this.browserInfo)    
        .then( (res) => { 
            res = preprocessor(res);
            if (res.error != undefined) {
                fm.setErrorMsg(res.error);
            } else {
                this.setFormDataField('items',res);
                this.setFormDataField('order',this.browserInfo.order);
                this.setFormDataField('offset',this.browserInfo.offset);
                fm.saveBrowserInfo(this.browserInfo);
                this.getTotalCount(newStatus);
            }   
        })        
    }

    /**
     * get total record count from database, show browser form
     * @param newStatus 
     */
    getTotalCount(newStatus: string) {
        let formData: FormData = this.getFormData();
        this.model.getTotal(this.browserInfo)
        .then( (res) => { 
            res = preprocessor(res);
            this.waiting(false);
            if (res.error != undefined) {
                fm.setErrorMsg(res.error);
            } else {
                this.setFormDataField('pages',Paginator.buildPages(res.count, this.browserInfo.limit));
                this.setFormDataField('total',res.count);
                this.setFormDataField('compStatus',newStatus);
            }   
        })   
    }

    /**
     * get records from databasem show browser
     */
    browser() {    
        window?.scrollTo(0,0);
        fm.clearMsgs();
        this.getItems('browser');
    }


    /**
     * get one record form database by id, show form
     * @param id 
     * @param newStatus 
     * always to be rewritten
     */
    getOneRecord = (id: string, newStatus: string) => {
        window?.scrollTo(0,0);
        this.waiting(true);
        this.model.getRecord(id)
        .then( (res) => { 
            res = preprocessor(res);
            this.waiting(false);
            if (res.error != undefined) {
                fm.setErrorMsg(res.error);
            } else {
                if (res.length > 0) {
                    this.setFormDataField('id',res[0].id);
                    this.setFormDataField('name',res[0].name);
                    this.setFormDataField('description',res[0].description);
                    this.setFormDataField('status',res[0].status);
                    this.setFormDataField('created_at',res[0].created_at);
                    this.setFormDataField('updated_at',res[0].updated_at);
                    this.setFormDataField('created_by',res[0].created_by);
                    this.setFormDataField('updated_by',res[0].updated_by);
                    this.setFormDataField('creatorName',res[0].user_creator.username_public);
                    this.setFormDataField('updaterName',res[0].user_modifier?.username_public);
                }    
                this.setFormDataField('compStatus',newStatus);
            }   
        })        
    }

    /**
     * read one record from database and show form
     * @param id 
     */
    show(id: string) {
        window?.scrollTo(0,0);
        fm.saveBrowserInfo(this.browserInfo);
        this.getOneRecord(id, 'show');
    }  

    /**
     * init new record and show form
     * always to be rewritten
     */
    new() {    
        window?.scrollTo(0,0);
        fm.saveBrowserInfo(this.browserInfo);
        document.getElementById('name')?.setAttribute('class','');
        document.getElementById('description')?.setAttribute('class','');
        document.getElementById('status')?.setAttribute('class','');
        fm.clearMsgs();

        // formData init 
        this.setFormDataField('id','');
        this.setFormDataField('name','');
        this.setFormDataField('description','');
        this.setFormDataField('status','');
        this.setFormDataField('created_at',fm.getCurrentDate());
        this.setFormDataField('created_by',this.user.id);
        this.setFormDataField('creatorName',this.user.nick);
        // display edit form
        this.setFormDataField('compStatus','edit');
        window.setTimeout("document.getElementById('name')?.focus()",1000);
    }

    /**
     * doDelete button click event handler
     * @param id 
     */
    doDelete = (id: string) => {
        window?.scrollTo(0,0);
        this.waiting(true);
        this.model.delete(id)
        .then( (res) => {
            this.waiting(false);
            res = preprocessor(res);
            if (res.error != undefined) {
                fm.setErrorMsg(res.error);
            } else { 
                fm.setSuccessMsg( t('DELETED') );
                window?.setTimeout(fm.clearMsgs,2000);
                this.getItems('browser');
            }    
        })
    }

    /**
     * do paginatorClick
     * @param id 
     */
    doPaginator(id:string) {    
        let formData: FormData = this.getFormData();
        let newOffset = formData.offset;
        if (id == 'paginatorFirst') newOffset = 0;
        if (id == 'paginatorPrev') newOffset = formData.offset - this.browserInfo.limit;
        if (id == 'paginatorNext') newOffset = formData.offset + this.browserInfo.limit;
        if (id == 'paginatorLast') {
            while (newOffset < formData.total ) {
                newOffset = newOffset + this.browserInfo.limit;
            }
            if (newOffset > formData.total) {
                newOffset = newOffset - this.browserInfo.limit;
            }    
        } 
        if (newOffset < 0) newOffset = 0;
        if (newOffset >= formData.total) newOffset = newOffset - this.browserInfo.limit;
        this.browserInfo.offset = newOffset;
        this.getItems('browser');
    }

    /**
     * reorder browser
     * @param name 
     */
    reOrder(name:string) {

        if ((name == undefined) || (name == '')) {
            return;
        } 
        let formData: FormData = this.getFormData();
        if (formData.offset != this.browserInfo.offset ) this.browserInfo.offset = formData.offset;
        let newOrder = formData.order;
        if (formData.order == name+': asc') {
            newOrder = name+': desc';
        } else {
            newOrder = name+': asc';
        }
        this.browserInfo.order = newOrder;
        this.setFormDataField('order', newOrder);
        this.getItems('browser');
    }

    /**
     * do filter from filterForm' fields, and show browser
     * @returns 
     * always to be rewritten
     */
    doFilter() {    
        let formData: FormData = this.getFormData();
        this.setFormDataField('offset',0);
        this.browserInfo.offset = 0;
        let operation = '';
        this.browserInfo.filter = [];
        /* example
        if (formData.filterName != '') {
            this.browserInfo.filter.push({
                operation:operation,
                relation:{field:'name', relType:'eq', value:formData.filterName}
            });
            operation = 'and';
        }    
        if (formData.filterStatus != '') {
            this.browserInfo.filter.push({
                operation:operation,
                relation:{field:'status', relType:'eq', value:formData.filterStatus}
            });
            operation = 'and';
        }    
        if (formData.filterDescription != '') {
            this.browserInfo.filter.push({
                operation:operation,
                relation:{field:'description', relType:'like', value:'%'+formData.filterDescription+'%'}
            });
            operation = 'and';
        }    
        */
        this.getItems('browser');
        return false;
    }

    /**
     * del filter and show browser
     * always to be rewritten
     */
    delFilter() {    
        /* example
        this.setFormDataField('filterName','');
        this.setFormDataField('filterDescription','');
        this.setFormDataField('filterStatus','');
        */
        this.browserInfo.filter = [];
        this.getItems('browser');
    }

    /**
     * form data validator
     * @returns string
     * always to be rewritten
     */
    validator = (): string => {
        fm.clearMsgs();
        let result = '';
        let formData: FormData = this.getFormData();
        /* example
        if (formData.name == '') {
            result += t('NAME_REQUIRED')+'<br />';
            fm.validMarker('name',false);
        } else {
            fm.validMarker('name',true);
        }
        if (formData.description == '') {
            result += t('DESCRIPTION_REQUIRED')+'<br />';
            fm.validMarker('description',false);
        } else {
            fm.validMarker('description',true);
        }
        if (formData.status == '') {
            result += t('STATUS_REQUIRED')+'<br />';
            fm.validMarker('status',false);
        } else {
            fm.validMarker('status',true);
        }
        */
        return result
    }

    /**
     * send click event handler
     * always to be rewritten
     */
    save = () => {
        let formData: FormData = this.getFormData();
        window?.scrollTo(0,0);
        this.waiting(true);
        const errorMsg = this.validator();
        let record: {};
        if (errorMsg != '') {
            this.waiting(false);
            this.setFormDataField('compStatus','edit');
            fm.setErrorMsg(errorMsg);
        } else {
            /* example
            if (formData.id == '') {
                record = {
                    name : formData.name,
                    description : formData.description,
                    status : formData.status,
                    created_at : fm.getCurrentDate(),
                    created_by : this.user.id,
                    updated_at : ''
                } 
            } else {
                record = {
                    id: formData.id,
                    name : formData.name,
                    description : formData.description,
                    status : formData.status,
                    created_at : formData.created_at,
                    created_by : formData.created_by,
                    updated_at : fm.getCurrentDate(),
                    updated_by : this.user.id,
                } 
            }   
            this.model.save(record)
            .then((res) => {
                this.waiting(false);
                res = preprocessor(res);
                if (res.error != undefined) {
                    fm.setErrorMsg(res.error);
                } else {
                    fm.setSuccessMsg(t('SAVED'));
                    window?.setTimeout(fm.clearMsgs,2000);
                    this.getItems('browser');
                }
            })
            */
        }
    }
}

