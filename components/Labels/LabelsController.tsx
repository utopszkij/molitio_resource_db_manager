'use client';
import { t } from '../Translator';    
import { getRecord, getRecords, preprocessor} from '../../objects/DatabaseInterface';
import { LabelModel, Record } from './LabelsModel';
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

    parentName: string,
    labelTypes: never[]; 
    // data form
    id: string,
    resource_label_type_id: string,
    value: string,
    created_by: string,
    creatorName: string,
    created_at: string,
    updated_by: string,
    updaterName: string,
    updated_at: string,
    // filter form
    filterTypeName: string,
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

export class LabelController extends Controller {
    parent_table: string = '';
    parent_id: string = '';
    parent_name: string = '';
    /**
     * setup controller 
     * @param id 
     * @param setFormDataField 
     * @param getFormData 
     */
    constructor() {
        super();
        this.browserName = 'labels';
        this.model = new LabelModel();  
    }

    filterIni() {
        this.browserInfo.offset = 0;
        this.browserInfo.order = 'resource_label_type.type_name: asc';
        this.browserInfo.filter = [
            { operator:'',
              relation:{
                field:'parent_table',
                relType:'eq',
                value:this.parent_table
              }
            },
            { operator:'and',
              relation:{
                field:'parent_id',
                relType:'eq',
                value:this.parent_id
              }
            }
        ];
        this.setFormDataField('order',this.browserInfo.order);
    }

    onLoad(id: string, setFormDataField:SetFormDataField, getFormData: GetFormData) {
        this.id = id;
        let w = this.id.split('.');
        this.parent_table = w[0];
        this.parent_id = w[1]; 
        this.setFormDataField = setFormDataField;
        this.getFormData = getFormData;
        // get parent table name
        getRecord('resource_schema',this.parent_table, ['name'], this.parent_id )
        .then ( (res) => {
            res = preprocessor(res);
            if (res.error == undefined) {
                this.parent_name = res[0].name;
                this.setFormDataField('parentName',this.parent_name);
            }    
        })
        // get all label_type
        getRecords('resource_schema','resource_label_type',
           ['id','type_name','unit'],
           ['type_name: asc'],
           []
        )
        .then((res) => {
            res = preprocessor(res);
            this.setFormDataField('labelTypes', res);
        })
        this.setFormDataField('parent_table',this.parent_table);
        this.setFormDataField('parent_id',this.parent_id);
        this.filterIni();
        this.getItems('browser',0);
    }


    /**
     * get one record form database by id, show form
     * @param id 
     * @param newStatus 
     */
    getOneRecord = (id: string, newStatus: string) => {
        window?.scrollTo(0,0);
        this.setFormDataField('compStatus','loader');
        this.model.getRecord(id)
        .then( (res) => { 
            res = preprocessor(res);
            if (res.error != undefined) {
                fm.setErrorMsg(res.error);
            } else {
                if (res.length > 0) {
                    this.setFormDataField('id',res[0].id);
                    this.setFormDataField('resource_label_type_id',res[0].resource_label_type_id);
                    this.setFormDataField('resource_label_type',res[0].resource_label_type);
                    this.setFormDataField('value',res[0].value);
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
        document.getElementById('resource_label_type_id')?.setAttribute('class','');
        document.getElementById('value')?.setAttribute('class','');
        fm.clearMsgs();

        // formData init 
        this.setFormDataField('id','');
        this.setFormDataField('resource_label_type_id','');
        this.setFormDataField('unit','');
        this.setFormDataField('created_at',fm.getCurrentDate());
        this.setFormDataField('created_by',this.user.id);
        this.setFormDataField('creatorName',this.user.nick);
        // display edit form
        this.setFormDataField('compStatus','edit');
        window.setTimeout("document.getElementById('type_name')?.focus()",1000);
    }

    /**
     * do filter from filterForm' fields, and show browser
     * @returns 
     */
    doFilter() {    
        let formData: FormData = this.getFormData();
        this.setFormDataField('offset',0);
        this.browserInfo.offset = 0;
        this.filterIni();
        let operation = 'and';
        if (formData.filterTypeName != '') {
            this.browserInfo.filter.push({
                operation:operation,
                relation:{field:'resource_label_type.type_name', 
                          relType:'eq', 
                          value:formData.filterTypeName}
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
        this.filterIni();
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
        if (formData.resource_label_type_id == '') {
            result += t('TYPE_REQUIRED')+'<br />';
            fm.validMarker('resource_label_type_id',false);
        } else {
            fm.validMarker('resource_label_type_id',true);
        }
        return result
    }

    /**
     * send click event handler
     */
    save = () => {
        window?.scrollTo(0,0);
        let formData = this.getFormData();
        this.setFormDataField('compStatus','loader');
        const errorMsg = this.validator();
        let record: {};
        if (errorMsg != '') {
            this.setFormDataField('compStatus','edit');
            fm.setErrorMsg(errorMsg);
        } else {
            if (formData.id == '') {
                record = {
                    resource_label_type_id : formData.resource_label_type_id,
                    value : formData.value,
                    parent_table : this.parent_table,
                    parent_id: this.parent_id, 
                    created_at : fm.getCurrentDate(),
                    created_by : this.user.id
                } 
            } else {
                record = {
                    id: formData.id,
                    resource_label_type_id : formData.resource_label_type_id,
                    value : formData.value,
                    parent_table : this.parent_table,
                    parent_id: this.parent_id, 
                    created_at : formData.created_at,
                    created_by : formData.created_by,
                    updated_at : fm.getCurrentDate(),
                    updated_by : this.user.id,
                } 
            }    
            this.model.save(record)
            .then((res) => {
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

