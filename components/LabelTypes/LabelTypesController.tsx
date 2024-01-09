'use client';
import { t } from '../Translator';    
import { preprocessor} from '../../objects/DatabaseInterface';
import { LabelTypeModel, Record } from './LabelTypesModel';
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
    type_name: string,
    unit: string,
    created_by: string,
    creatorName: string,
    created_at: string,
    updated_by: string,
    updaterName: string,
    updated_at: string,
    // filter form
    filterTypeName: string,
    filterUnit: string,
    // browser
    offset:number,
    order:string,
    total:number,
    items: never[],
    pages: never[]
}

/**
 * set one fomData field value function
 */
type SetFormDataField = (name:string, value:any) => void;
type GetFormData = () => FormData;

export class LabelTypeController extends Controller {
    /**
     * setup controller 
     * @param id 
     * @param setFormDataField 
     * @param getFormData 
     */
    constructor() {
        super();
        this.browserName = 'labelTypes';
        this.model = new LabelTypeModel();  
    }

    onLoad(id: string, setFormDataField:SetFormDataField, getFormData: GetFormData) {
        this.id = id;
        this.setFormDataField = setFormDataField;
        this.getFormData = getFormData;
        let i = 0;
        let filterField = '';
        if (this.id == '0') {
            this.browserInfo.filter = [];
            this.setFormDataField('filterTypeName','');
            this.setFormDataField('filterUnit','');
            this.getItems('browser');
        } else {
            for(i = 0; i < this.browserInfo.filter.length; i++) {
                filterField = this.browserInfo.filter[i].relation.fieldName;
                if (filterField == 'type_name') {
                    this.setFormDataField('filterTyeName', 
                    this.browserInfo.filter[i].realtion.value);                        
                }
                if (filterField == 'unit') {
                    this.setFormDataField('filterUnit', 
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
            res = preprocessor(res);
            this.waiting(false);
            if (res.error != undefined) {
                fm.setErrorMsg(res.error);
            } else {
                if (res.length > 0) {
                    this.setFormDataField('id',res[0].id);
                    this.setFormDataField('type_name',res[0].type_name);
                    this.setFormDataField('unit',res[0].unit);
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
        document.getElementById('type_name')?.setAttribute('class','');
        document.getElementById('unit')?.setAttribute('class','');
        fm.clearMsgs();

        // formData init 
        this.setFormDataField('id','');
        this.setFormDataField('type_name','');
        this.setFormDataField('unit','');
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
        if (formData.filterTypeName != '') {
            this.browserInfo.filter.push({
                operation:operation,
                relation:{field:'type_name', relType:'eq', value:formData.filterTypeName}
            });
            operation = 'and';
        }    
        if (formData.filterUnit != '') {
            this.browserInfo.filter.push({
                operation:operation,
                relation:{field:'unit', relType:'eq', value:formData.filterUnit}
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
        this.setFormDataField('filterTypeName','');
        this.setFormDataField('filterUnit','');
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
        if (formData.type_name == '') {
            result += t('NAME_REQUIRED')+'<br />';
            fm.validMarker('type_name',false);
        } else {
            fm.validMarker('type_name',true);
        }
        return result
    }

    /**
     * send click event handler
     */
    save = () => {
        window?.scrollTo(0,0);
        let formData = this.getFormData();
        const errorMsg = this.validator();
        let record: {};
        if (errorMsg != '') {
            this.setFormDataField('compStatus','edit');
            fm.setErrorMsg(errorMsg);
        } else {
            this.waiting(true);
            if (formData.id == '') {
                record = {
                    type_name : formData.type_name,
                    unit : formData.unit,
                    created_at : fm.getCurrentDate(),
                    created_by : this.user.id
                } 
            } else {
                record = {
                    id: formData.id,
                    type_name : formData.type_name,
                    unit : formData.unit,
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

