'use client';
import { t } from '../Translator';    
import { preprocessor} from '../../objects/DatabaseInterface';
import { CollectionModel, Record  } from './CollectionsModel';
import { CommunityModel } from '../Communities/CommunitiesModel';
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
    owner: string,
    description: string,
    status: string,
    created_by: string,
    creatorName: string,
    created_at: string,
    updated_by: string,
    updaterName: string,
    updated_at: string,
    community_id: string,
    communityName: string,
    // filter form
    filterCommunityName: string,
    filterCommunityId: string,
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

export class CollectionController extends Controller {

    /**
     * setup controller 
     */
    constructor() {
        super();
        this.browserName = 'collections';
        this.model = new CollectionModel();   
    }

    onLoad(id: string, setFormDataField:SetFormDataField, getFormData: GetFormData) {
        this.id = id;

console.log('communityModel.getRecord jon', this.id);

        this.setFormDataField = setFormDataField;
        this.getFormData = getFormData;
        let i = 0;
        let filterField = '';
        let communityModel = new CommunityModel();
        if (this.id == '0') {
            this.browserInfo.filter = [];
            this.setFormDataField('filterCommunityName','');
            this.setFormDataField('filterCommunityId','');
            this.getItems('browser');
        } else {
            // this.id is community? 
            communityModel.getRecord(this.id)
            .then( (res) => {


console.log(res);


                res = preprocessor(res);
                if ((res.error == undefined) && (res.lenght > 0)) {
                    // yes this.id is community --> browser by filter
                    this.setFormDataField('communityName',res[0].name);
                    this.setFormDataField('filterCommunityName',res[0].name);
                    this.setFormDataField('filterCommunityId',this.id);
                    this.browserInfo.filter = [
                        {operator:'',
                        relation:{
                            field:'resource_community_id',
                            relType: 'eq',
                            value: this.id
                        }
                        }
                    ];
                    this.getItems('browser');
                } else {
                    // no this.id not community --> show this.id collection
                    this.show(this.id);
                }    
            })
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
                    this.setFormDataField('community_id',res[0].resource_community_id);
                    this.setFormDataField('communityName',res[0].resource_community.name);
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
        this.setFormDataField('community_id',this.id);
        // get community
        let communityModel = new CommunityModel();
        communityModel.getRecord(this.id)
        .then( (res) => {
            res = preprocessor(res);
            this.setFormDataField('communityName',res[0].name);
        })
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
        if (formData.filterCommunityId != '') {
            this.browserInfo.filter.push({
                operation:operation,
                relation:{field:'resource_community_id', relType:'eq', value: formData.filterCommunityId}
            });
            operation = 'and';
        }  
        if (formData.filterCommunityName != '') {
            this.browserInfo.filter.push({
                operation:operation,
                relation:{field:'resource_community.name', relType:'eq', value: formData.filterCommunityName}
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
        let formData: FormData = this.getFormData();
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
        const errorMsg = this.validator();
        let formData: FormData = this.getFormData();
        //let record = this.model.initRecord();
        if (errorMsg != '') {
            this.setFormDataField('compStatus','edit');
            fm.setErrorMsg(errorMsg);
        } else {
            this.waiting(true);
            let record = {};
            if (formData.id == '') {
                record = {
                    name : formData.name,
                    description : formData.description,
                    status : formData.status,
                    created_at : fm.getCurrentDate(),
                    created_by : this.user.id,
                    resource_community_id: this.id 
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

