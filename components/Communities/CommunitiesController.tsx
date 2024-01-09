'use client';
import { t } from '../Translator';    
import { preprocessor} from '../../objects/DatabaseInterface';
import { CommunityModel, Record } from './CommunitiesModel';
import { Controller } from '../../objects/Controller';
import { fm } from '../../objects/FormManager';

/**
 * formData objektum
 */
export type FormData = {
    compStatus: string,
    // messages
    errorMsg: string,
    successMsg: string,
    // data form
    id: string,
    name: string,
    description: string,
    status: string,
    created_by: string,
    creatorName: string,
    created_at: string,
    updated_by: string,
    updaterName: string,
    updated_at: string,
    // filter form
    filterName: string,
    filterDescription: string,
    filterStatus: string,
    // browser
    offset:number,
    order:string,
    total:number,
    items: never[],
    pages: never[]
}

/**
 * set one firmData field value function
 */
type SetFormDataField = (name:string, value:any) => void;
type GetFormData = () => FormData;

export class CommunityController extends Controller {
    /**
     * setup controller 
     * @param id 
     * @param setFormDataField 
     * @param getFormData 
     */
    constructor() {
        super();
        this.browserName = 'communities';
        this.model = new CommunityModel();  
    }

    onLoad(id: string, setFormDataField:SetFormDataField, getFormData: GetFormData) {
        this.id = id;
        this.setFormDataField = setFormDataField;
        this.getFormData = getFormData;
        let i = 0;
        let filterField = '';
        if (this.id == '0') {
            this.browserInfo.filter = [];
            this.setFormDataField('filterCommunityName','');
            this.setFormDataField('filterCommunityId','');
            this.getItems('browser');
        } else {
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
            this.show(this.id);
        }
    }


    /**
     * get one record form database by id, show form
     * @param id 
     * @param newStatus 
     */
    getOneRecord = (id: string, newStatus: string) => {
        window?.scrollTo(0,0);
        this.waiting(true);
        this.model.getRecord(id)
        .then( (res) => { 
            this.waiting(false);
            res = preprocessor(res);
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
     * init new record and show form
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
     * do filter from filterForm' fields, and show browser
     * @returns 
     */
    doFilter() {    
        let formData: FormData = this.getFormData();
        this.setFormDataField('offset',0);
        this.browserInfo.offset = 0;
        let operation = '';
        this.browserInfo.filter = [];
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
        this.getItems('browser');
        return false;
    }

    /**
     * del filter and show browser
     */
    delFilter() {    
        this.setFormDataField('filterName','');
        this.setFormDataField('filterDescription','');
        this.setFormDataField('filterStatus','');
        this.browserInfo.filter = [];
        this.getItems('browser');
    }

    /**
     * form data validator
     * @returns string
     */
    validator = (): string => {
        fm.clearMsgs();
        let result = '';
        let formData = this.getFormData();
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
        return result
    }

    /**
     * send click event handler
     */
    save = () => {
        window?.scrollTo(0,0);
        let formData = this.getFormData();
        this.waiting(true);
        const errorMsg = this.validator();
        let record: {};
        if (errorMsg != '') {
            this.waiting(false);
            this.setFormDataField('compStatus','edit');
            fm.setErrorMsg(errorMsg);
        } else {
            if (formData.id == '') {
                record = {
                    name : formData.name,
                    description : formData.description,
                    status : formData.status,
                    created_at : fm.getCurrentDate(),
                    created_by : this.user.id
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
        }
    }
}

