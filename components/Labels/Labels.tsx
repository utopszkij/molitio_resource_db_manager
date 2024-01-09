'use client';
import React, { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { SiteLayout } from '../SiteLayout';
import Styles from './Labels.module.scss';
// translator system
import { selectTranslatorData, useAppDispatch, useAppSelector } from '../../context/store';
import { Translator, t } from '../Translator';    
// cookie  system
import { Cookies } from '../CookieConsent';
import { selectCookieConsentData } from '../../context/store';
import { CookieConsentData } from '../../context/types';
// user regist/login system
import { AuthenticatedUser } from '../../context/types';        
// database interface
import { insert, update, getRecords, getTotal, getRecord, remove, preprocessor} from '../../objects/DatabaseInterface';
// form manager support
import { BrowserInfo, fm } from '../../objects/FormManager';
// paginator support
import { Paginator } from '../../objects/Paginator';
import { Record } from './LabelsModel';
import { LabelController, FormData } from './LabelsController';

const ctrl = new LabelController();

/**
* resources community manager REACT component
* For the form input to work, it must be a top-level component. 
* Therefore, it cannot be defined in the siteLayout parameter!
*/
const _Labels = ( params: any ): React.JSX.Element => {
    // general data
    const browserName = 'labels';
    const dispatch = useAppDispatch();

    let w = params.id.split('.');
    let parentTable = w[0];
    let parentId =  w[1];

    let record:Record = {
        id: '',
        created_at: '',
        created_by: '',
        updated_by: '',
        updated_at: '',
        parent_table: '',
        parent_id : '',
        resource_label_type_id: '',
        value: '',
        resource_label_type:{type_name:'', unit:''}
    } 

    // test user data, must overwrite it!
    let user:AuthenticatedUser = {
        id:"f67714ca-0138-4b77-be88-28f36ecf026b",
        accessToken:'',
        fullname:'',
        email:'', 
        nick:"admin",
        avatar:"noavatar.png",
        roles:[""]
    }

    // translator data
    const translatorData = useAppSelector(selectTranslatorData);
    Translator.translatorData = translatorData;

    // cokkie consent data
    const cookieConsentData: CookieConsentData = useAppSelector(selectCookieConsentData);

    // browser datas
    let browserInfo:BrowserInfo = fm.getBrowserInfo(browserName);
  
    /**
     *  data for form 
     */ 
    const [formData, setFormData] = React.useState({
        compStatus: '',
        // messages
        errorMsg: '',
        successMsg: '',
        // data form
        id: record.id,
        created_by: record.created_by,
        creatorName: '',
        created_at: record.created_at,
        updated_by: record.updated_by,
        updaterName: '',
        updated_at: record.updated_at,
        parent_table: '',
        parent_id : '',
        resource_label_type_id: '',
        value: '',
        labelTypes: [],
        resource_label_type:{type_name:'', unit:''},
        // filter form
        parentName: '',
        filterTypeName: '',
        // browser
        offset:0,
        order:'resource_label_type.type_name: asc',
        total:0,
        items: [],
        pages:[]
    })

    /**
     * set one filed in formData
     * @param fname mező neve
     * @param value érték
     */
    const setFormDataField = (fname: string, value: any):void => {
        setFormData((prevState) => ({
            ...prevState,
            [fname]: value,
        }));
    }

    const getFormData = (): FormData => {
        return formData;
    }

    // refresh ctrl.getFormData where change formData
    ctrl.getFormData = getFormData;

    
    /**
     * form onload function
     */
    var runOnLoad = true;
    useEffect(() => {
        if (runOnLoad) {
            fm.init(setFormDataField); // setup formManager
            // ENTER keup --> default button action
            document.addEventListener("keyup", keyUpHandler);
            // load dictionaries
            Translator.loadDictionaries('', dispatch);
            // load browser info from cookie
            ctrl.browserInfo = fm.getBrowserInfo(ctrl.browserName);
            // onload functions
            ctrl.onLoad(params.id,setFormDataField, getFormData);
            runOnLoad = false;
        }    
    }, []);


    /**
     * errorMsg or successmsg close btn click event handler
     */
    const msgCloseBtnClick = () => {
        fm.clearMsgs();
    }

    /**
     * send click event handler
     */
    const saveClick = () => {
        ctrl.save();
    }

    /**
     * cancel click event handler
     */
    const cancelClick = () => {
        window?.scrollTo(0,0);
        fm.clearMsgs();
        setFormDataField('compStatus','browser');
    }

    /**
     * get items from database, use browserInfo, save into formData
     * use browserInfo, call getTotal
     */
    const getItems = (newStatus: string, newOffset?:number) => {
        ctrl.getItems(newStatus, newOffset)
    }

    /**
     * get one record form database by id
     * @param id 
     * @param newStatus 
     */
    const getOneRecord = (id: string, newStatus: string) => {
        ctrl.getOneRecord(id,newStatus)
    }

    /**
     * show button click event handler
     * @param id 
     */
    const showClick = (id: string) => {
        ctrl.getOneRecord(id, 'show')
    }  

    /**
     * new button click event handler
     */
    const newClick = () => {
        ctrl.new();
    }

    /**
     * doDelete button click event handler
     * @param id 
     */
    const doDelete = (id: string) => {
        ctrl.doDelete(id);
    }

    /**
     * event handler ENTER -> default button click
     * @param e keUp 
     */
    const keyUpHandler = (e:any) => {
        if (!e.shiftKey) {
            if (e.keyCode == 13) {    
                if (e.target.id == 'filterTypeName') {
                    document.getElementById('doFilter')?.click()    
                }
                if (e.target.id == 'value') {
                    document.getElementById('saveBtn')?.click()    
                }    
            }
        }
    }    

    /**
     * paginator button click event handler
     * @param e 
     */
    const paginatorClick = (e:any) => {
        // e.target.id alapján kell müködnie
        // total, offset, limit használatával új offset -et határoz meg és
        // items-et olvas az adatbázisból
        const id = e.target.id;

        ctrl.doPaginator(id);
        getItems('browser');
    }

    /**
     * order up/down icon into browser table header
     * @param name 
     * @param order 
     * @return string 
     */
    const thIcon = (name:string, order:string) => {
            let result = '';
            if (order == name+': asc') {
                result = '&#9660; ';  
            }
            if (order == name+': desc') {
                result = '&#9650; ';  
            }
            return result;
    }

    /**
     * user click table header event handler --> reOrder
     * @param e 
    */
    const thClick = (e:any) => {
        let name = e.target.id.substring(2,100);
        ctrl.reOrder(name);
    }

    /**
     * user click formFilter "start" event handler
    */
    const doFilter = () => {
            ctrl.doFilter();
            return false;
    }

    /**
     * user click "del filter" event handler
     */
    const delFilter = () => {
        ctrl.delFilter();
        return false;
    }

    /**
     * link into parentTable show
     * @return string 
     */
    const parentLink = ():string => {
        let result = '';
        if (formData.parent_table == 'resource_community') {
            result = '/'+formData.parent_id+'/communities';
        }
        if (formData.parent_table == 'resource_collection') {
            result = '/'+formData.parent_id+'/collections';
        }
        if (formData.parent_table == 'resource') {
            result = '/'+formData.parent_id+'/resources';
        }
        return result;
    }

    return (
                <div id="labels" className={Styles.subPage}>
                    { (parentId > '0') &&
                    <h2><a href={ parentLink() } className={Styles.parentLink}>
                        &#9758; { formData.parentName } {parentTable} </a></h2>
                    }
                    {(formData.errorMsg != '') &&
                        <div className="errorMsg">
                            <div className="msgCloseBtn">
                                <button type="button" onClick={msgCloseBtnClick}>X</button>
                            </div>    
                            <div dangerouslySetInnerHTML={{ __html: formData.errorMsg }}></div>
                        </div>
                    }
                    {(formData.successMsg != '') &&
                        <div className="successMsg">
                            <div className="msgCloseBtn">
                                <button type="button" onClick={msgCloseBtnClick}>X</button>
                            </div>    
                            <div dangerouslySetInnerHTML={{ __html: formData.successMsg }}></div>
                        </div>    
                    }
                    <div id="waiting"></div>
                    <br /><br />
                    {(formData.compStatus == 'browser') && 
                        <div className="browser">
                            <h2>Labels browser</h2>
                            <div className="col_d6_p12">
                                <div className={Styles.filterForm}>
                                <h3>{ t('FILTER')}</h3>
                                <form className="form">
                                    <div className="formControl">
                                        <label>{ t('label_type_name')}:</label>
                                        <input type="text" 
                                                name="filterTypeName"
                                                id="filterTypeName" 
                                                value={formData.filterTypeName}
                                                onChange={fm.handleInput}
                                                />
                                        <button type="button" id="doFilter" className="btn" onClick={doFilter}>&#128270;start</button>         
                                        <button type="button" className="btn" onClick={delFilter}>X</button>         
                                    </div>
                                </form>
                                </div>
                            </div>    
                            <table className={Styles.brTable}>
                                <thead className="brHeader">
                                    {(browserInfo.limit < 10) &&
                                    <tr><th>{ t('SORT') }</th></tr>
                                    }
                                    <tr>
                                        <th></th>
                                        <th className={Styles.th} id="thresource_label_type.type_name"
                                            onClick={thClick}>
                                            <var onClick={() => ctrl.reOrder('resource_label_type.type_name')}
                                                 dangerouslySetInnerHTML={{ __html: thIcon('resource_label_type.type_name',formData.order) }}></var>
                                            { t('label_type_name') }</th>
                                        <th className={Styles.th} id="thvalue"
                                            onClick={thClick}>
                                            <var onClick={() => ctrl.reOrder('value')}
                                                 dangerouslySetInnerHTML={{ __html: thIcon('value',formData.order) }}></var>
                                            { t('value') }</th>
                                        <th className={Styles.th} id="thresource_label_type.unit"
                                            onClick={thClick}>
                                            <var onClick={() => ctrl.reOrder('resource_label_type.unit')}
                                                 dangerouslySetInnerHTML={{ __html: thIcon('resource_label_type.unit',formData.order) }}></var>
                                            { t('unit') }</th>
                                        <th className={Styles.th} id="thcreated_at"
                                            onClick={thClick}>
                                            <var onClick={() => ctrl.reOrder('created_at')}
                                                 dangerouslySetInnerHTML={{ __html: thIcon('created_at',formData.order) }}></var>
                                            { t('created_at') }</th>
                                    </tr>    
                                </thead>
                                <tbody className="brBody">
                                { formData.items.map( (item: Record, index) => 
                                    <tr key={index}>
                                        <td className={Styles.thButtons}>
                                            <button type="button" title="edit" 
                                                onClick={() => getOneRecord(item.id,'edit')}>
                                                &#9997;</button>
                                            <button className="alert_danger" type="button" title="delete"
                                                onClick={() => getOneRecord(item.id,'delete') }>
                                                x</button>
                                            <button type="button" title="show"
                                                onClick={() => getOneRecord(item.id, 'show') }>
                                                &#9758;</button>
                                        </td>
                                        <td>        
                                            { item.resource_label_type.type_name }</td>
                                        <td>{ item.value.substring(0,60) }</td>
                                        <td>{ item.resource_label_type.unit }</td>
                                        <td>{ item.created_at }</td>
                                    </tr> 
                                )}
                                </tbody>
                            </table>
                            <div className="paginator">
                                { t('TOTAL')} : {formData.total} { t('DATA') }<br />
                                <button type="button" onClick={paginatorClick} id="paginatorFirst">|&#8882;</button> 
                                <button type="button" onClick={paginatorClick} id="paginatorPrev">&#8882;</button> 
                                { formData.pages.map( (item: number, index) => 
                                    <>
                                    { (Paginator.visiblePaginator(formData.offset,
                                                                  browserInfo.limit,
                                                                  index)) && 
                                      <button type="button" className="btn" onClick={() => getItems('browser',item)}>
                                        { index+1 }</button>
                                    }
                                    {(item == browserInfo.offset) &&
                                        <strong>&nbsp;  { index + 1} &nbsp;</strong>
                                    }
                                    </>
                                )}        
                                <button type="button" onClick={paginatorClick} id="paginatorNext">&#8883;</button> 
                                <button type="button" onClick={paginatorClick} id="paginatorLast">&#8883;|</button> 
                            </div>    


                            <div className={Styles.browserButtons}>
                                <button type="button" className="btn" onClick={newClick} title="new">
                                    +{ t('new') }
                                </button>
                            </div>
                        </div>

                    }   
                    {(formData.compStatus == 'show') && 
                        <div className={Styles.show}>
                            <h2>{ t('labels') }</h2>
                            <a href={ '/resource_labels.'+formData.id+'/labels'} 
                                className="btn_primary">&#9758;{ t('labels') }</a> &nbsp;
                            <a href="" className="btn_primary">&#9758;{ t('collections') }</a> &nbsp;
                            <form className="form">
                                <div className="formControl">
                                    <label>{ t('id')}:</label>
                                    <strong>#{ formData.id }</strong>
                                </div>
                                <div className="formControl">
                                    <label>{ t('name')}:</label>
                                    { formData.resource_label_type.type_name }&nbsp;
                                    [{ formData.resource_label_type.unit }]&nbsp;
                                    
                                </div>
                                <div className="formControl">
                                    <label>{ t('description')}:</label>
                                    <textarea 
                                            name="description"
                                            id="description"
                                            readOnly={true}
                                            value={formData.value}></textarea>
                                    { formData.resource_label_type.unit }        

                                </div>
                                <div className="formControl">
                                    <label>{ t('created_at')}:</label>
                                    { formData.created_at }
                                </div>
                                <div className="formControl">
                                    <label>{ t('created_by')}:</label>
                                    { formData.creatorName }
                                </div>
                                <div className="formControl">
                                    <label>{ t('updated_by')}:</label>
                                    { formData.updaterName }
                                </div>
                                <div className="formControl">
                                    <label>{ t('updated_at')}:</label>
                                    { formData.updated_at }
                                </div>
                                <div className="formButtons">
                                    <button type="button" className="btn_cancel" onClick={cancelClick}>
                                        &#8617;{ t('ok') }
                                    </button>
                                </div>
                            </form>
                        </div>
                    }   
                    {(formData.compStatus == 'edit') && 
                        <div className="edit">
                            <h2>{ t('labels') }</h2>
                            {( formData.id == '') && <h2>{ t('new')}</h2>}
                            {( formData.id != '') && <h2>{ t('edit')}</h2>}
                            <form className="form">
                                <div className="formControl">
                                    <label>{ t('id')}:</label>
                                    <strong>#{ formData.id }</strong>
                                </div>
                                <div className="formControl">
                                    <label>{ t('resource_label_type_id')}:</label>
                                    <select name="resource_label_type_id"
                                            id="resource_label_type_id" 
                                            value={formData.resource_label_type_id}
                                            onChange={fm.handleInput}>
                                    <option value="">{ t('please_select') }</option>            
                                    { formData.labelTypes.map((item:any, index) => 
                                         <option value={item.id}> {item.type_name}  [{ item.unit }]</option>   
                                    )}    
                                    </select>
                                </div>
                                <div className="formControl">
                                    <label>{ t('value')}:</label>
                                    <textarea 
                                            name="value"
                                            id="value"
                                            value={formData.value}
                                            onChange={fm.handleInput}></textarea>
                                </div>
                                <div className="formControl">
                                    <label>{ t('created_at')}:</label>
                                    { formData.created_at }
                                </div>
                                <div className="formControl">
                                    <label>{ t('created_by')}:</label>
                                    { formData.creatorName }
                                </div>
                                <div className="formControl">
                                    <label>{ t('updated_by')}:</label>
                                    { formData.updaterName }
                                </div>
                                <div className="formControl">
                                    <label>{ t('updated_at')}:</label>
                                    { formData.updated_at }
                                </div>
                                <div className="formButtons">
                                    <button type="button" id="saveBtn" className="btn_ok" onClick={saveClick}>
                                         &#9745;{ t('send') }
                                    </button>
                                    &nbsp;
                                    <button type="button" className="btn_cancel" onClick={cancelClick}>
                                        &#9746;{ t('cancel') }
                                    </button>
                                </div>
                            </form>
                        </div>
                    }    
                    {(formData.compStatus == 'delete') && 
                        <div className={Styles.deleteForm}>
                            <h2>{formData.resource_label_type.type_name}</h2>
                            <div>{ formData.value}</div>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>
                            <h3>{ t('delete') } ?</h3>
                            <div>&nbsp;</div>
                            <div className="formButtons">
                                <button type="button" className="btn_danger"
                                    onClick={ () => doDelete(formData.id) }>
                                    { t('delete') }                                            
                                </button>
                                &nbsp;
                                <button type="button" className="btn_primary"
                                    onClick={ () => setFormDataField('compStatus','browser') }>
                                    { t('cancel') }                                            
                                </button>
                            </div>    
                        </div>
                    }   
                </div>
    );
};

const Labels = ( params: any ) => {
    return SiteLayout({
        PageContent: () => { return _Labels(params);}
    });
}
export default Labels;
