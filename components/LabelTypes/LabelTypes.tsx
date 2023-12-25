'use client';
import React, { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { SiteLayout } from '../SiteLayout';
import Styles from './LabelTypes.module.scss';
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
/**
 * LabelTypes record
 */
export type LabelTypeRecord = {
    id: string,
    type_name: string,
    unit: string,
    created_by: string,
    created_at: string,
    updated_by: string,
    updated_at: string,
}

/**
* resources labelTypes manager REACT component
* For the form input to work, it must be a top-level component. 
* Therefore, it cannot be defined in the siteLayout parameter!
*/
const _LabelTypes = ( params: any ): React.JSX.Element => {
    // general data
    const browserName = 'labelTypes';
    const dispatch = useAppDispatch();
    const [compStatus, setCompStatus] = useState(''); // 'loader'|'browser'|'show'|'edit'|'delete'|'none'
    let id = params.id;

    let record:LabelTypeRecord = {
        id: '',
        type_name: '',    
        unit: '',
        created_at: '',
        created_by: '',
        updated_by: '',
        updated_at: '',
    } 

    // test user data, must overwrite it!
    let user:AuthenticatedUser = fm.testUser;

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
        // messages
        errorMsg: '',
        successMsg: '',
        // data form
        id: record.id,
        type_name: record.type_name,
        unit: record.unit,
        created_by: record.created_by,
        creatorName: '',
        created_at: record.created_at,
        updated_by: record.updated_by,
        updaterName: '',
        updated_at: record.updated_at,
        // filter form
        filterTypeName: '',
        filterUnit: '',
        // browser
        offset:0,
        order:'type_name: asc',
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
    fm.init(setFormDataField); // setup formManager
    
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
        window?.scrollTo(0,0);
        setCompStatus('loader');
        const errorMsg = validator();
        if (errorMsg != '') {
            setCompStatus('edit');
            fm.setErrorMsg(errorMsg);
        } else {
            if (formData.id == '') {
                let record = {
                    type_name : formData.type_name,
                    unit : formData.unit,
                    created_at : fm.getCurrentDate(),
                    created_by : user.id,
                } 
                insert('resource_schema','resource_label_type', record)
                .then((res) => {
                    res = preprocessor(res);
                    if (res.error != undefined) {
                        fm.setErrorMsg(res.error);
                    } else {
                        fm.setSuccessMsg(t('SAVED'));
                        window?.setTimeout(fm.clearMsgs,2000);
                        getItems('browser');
                    }
                })
            } else {
                let record = {
                    id: formData.id,
                    type_name : formData.type_name,
                    unit : formData.unit,
                    created_at : formData.created_at,
                    created_by : formData.created_by,
                    updated_at : fm.getCurrentDate(),
                    updated_by : user.id,
                } 
                update('resource_schema','resource_label_type',record.id, record)
                .then((res) => {
                    res = preprocessor(res);
                    if (res.error != undefined) {
                        fm.setErrorMsg(res.error);
                    } else {
                        fm.setSuccessMsg(t('SAVED'));
                        window?.setTimeout(fm.clearMsgs,2000);
                        getItems('browser');
                    }
                })
            }
        }
    }

    /**
     * cancel click event handler
     */
    const cancelClick = () => {
        window?.scrollTo(0,0);
        fm.clearMsgs();
        setCompStatus('browser')
    }

    /**
     * form data validator
     * @returns string
     */
    const validator = (): string => {
        fm.clearMsgs();
        let result = '';
        if (formData.type_name == '') {
            result += t('NAME_REQUIRED')+'<br />';
            fm.validMarker('type_name',false);
        } else {
            fm.validMarker('type_name',true);
        }
        return result
    }

    /**
     * get items from database, use browserInfo, save into formData
     * use browserInfo, call getTotal
     */
    const getItems = (newStatus: string, newOffset?:number) => {
        window?.scrollTo(0,0);
        setCompStatus('loader');
        if (newOffset != undefined) {
            browserInfo.offset = newOffset;
            setFormDataField('offset',newOffset);
        }
        getRecords('resource_schema', 'resource_label_type',
            ['id','type_name','unit','created_at',
              'user_creator.username_public', 'user_modifier.username_public' ], 
            [browserInfo.order], 
            browserInfo.filter,
            browserInfo.offset,
            browserInfo.limit
        ).then( (res) => { 
            res = preprocessor(res);
            if (res.error != undefined) {
                fm.setErrorMsg(res.error);
            } else {
                setFormDataField('items',res);
                setFormDataField('order',browserInfo.order);
                setFormDataField('offset',browserInfo.offset);
                fm.saveBrowserInfo(browserInfo);
                getTotalCount(newStatus);
            }   
        })        

    }

    /**
     * get total record count from database
     * @param newStatus 
     */
    const getTotalCount = (newStatus: string) => {
        getTotal('resource_schema', 'resource_label_type',
            browserInfo.filter
        ).then( (res) => { 
            res = preprocessor(res);
            if (res.error != undefined) {
                fm.setErrorMsg(res.error);
            } else {
                setFormDataField('pages',Paginator.buildPages(res.count, browserInfo.limit));
                setFormDataField('total',res.count);
                setCompStatus(newStatus);
            }   
        })        
    }

    /**
     * get one record form database by id
     * @param id 
     * @param newStatus 
     */
    const getOneRecord = (id: string, newStatus: string) => {
        window?.scrollTo(0,0);
        setCompStatus('loader');
        getRecord('resource_schema', 'resource_label_type',
            ['id','type_name','unit','created_at','created_by',
              'updated_at','updated_by',  
              'user_creator.username_public', 'user_modifier.username_public' ], 
            id  
        ).then( (res) => { 
            res = preprocessor(res);
            if (res.error != undefined) {
                fm.setErrorMsg(res.error);
            } else {
                if (res.length > 0) {
                    setFormDataField('id',res[0].id);
                    setFormDataField('type_name',res[0].type_name);
                    setFormDataField('unit',res[0].unit);
                    setFormDataField('created_at',res[0].created_at);
                    setFormDataField('updated_at',res[0].updated_at);
                    setFormDataField('created_by',res[0].created_by);
                    setFormDataField('updated_by',res[0].updated_by);
                    setFormDataField('creatorName',res[0].user_creator.username_public);
                    setFormDataField('updaterName',res[0].user_modifier?.username_public);
                }    
                getTotalCount(newStatus);
            }   
        })        
    }

    /**
     * show button click event handler
     * @param id 
     */
    const showClick = (id: string) => {
        window?.scrollTo(0,0);
        setCompStatus('loader');
        fm.saveBrowserInfo(browserInfo);
        getOneRecord(id, 'show');
    }  

    /**
     * new button click event handler
     */
    const newClick = () => {
        window?.scrollTo(0,0);
        fm.saveBrowserInfo(browserInfo);
        document.getElementById('type_name')?.setAttribute('class','');
        document.getElementById('unit')?.setAttribute('class','');
        fm.clearMsgs();

        // formData init 
        setFormDataField('id','');
        setFormDataField('type_name','');
        setFormDataField('unit','');
        setFormDataField('created_at',fm.getCurrentDate());
        setFormDataField('created_by',user.id);
        setFormDataField('creatorName',user.nick);
        // display edit form
        setCompStatus('edit');
        window.setTimeout("document.getElementById('type_name')?.focus()",1000);
    }

    /**
     * doDelete button click event handler
     * @param id 
     */
    const doDelete = (id: string) => {
        window?.scrollTo(0,0);
        setCompStatus('loader');
        remove('resource_schema','resource_label_type', id)
        .then( (res) => {
            res = preprocessor(res);
            console.log(res);
            if (res.error != undefined) {
                fm.setErrorMsg(res.error);
            } else {    
                fm.setSuccessMsg( t('DELETED') );
                window?.setTimeout(fm.clearMsgs,2000);
                getItems('browser');
            }    
        })
    }

    /**
     * event handler ENTER -> default button click
     * @param e keUp 
     */
    const keyUpHandler = (e:any) => {
        if (!e.shiftKey) {
            if (e.keyCode == 13) {    
                if ((e.target.id == 'filterTypeName') ||
                    (e.target.id == 'filterUnit')) {
                    document.getElementById('doFilter')?.click();    
                }
                if ((e.target.id == 'type_name') ||
                    (e.target.id == 'unit')) {
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
        let newOffset = formData.offset;
        if (id == 'paginatorFirst') newOffset = 0;
        if (id == 'paginatorPrev') newOffset = formData.offset - browserInfo.limit;
        if (id == 'paginatorNext') newOffset = formData.offset + browserInfo.limit;
        if (id == 'paginatorLast') {
            while (newOffset < formData.total ) {
                newOffset = newOffset + browserInfo.limit;
            }
            if (newOffset > formData.total) {
                newOffset = newOffset - browserInfo.limit;
            }    
        } 
        if (newOffset < 0) newOffset = 0;
        if (newOffset >= formData.total) newOffset = newOffset - browserInfo.limit;
        browserInfo.offset = newOffset;
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
            if (formData.offset != browserInfo.offset ) browserInfo.offset = formData.offset;
            let newOrder = formData.order;
            const name = e.target.id.substring(2,100);
            if (formData.order == name+': asc') {
                newOrder = name+': desc';
            } else {
                newOrder = name+': asc';
            }
            browserInfo.order = newOrder;
            getItems('browser');
    }

    /**
     * user click formFilter "start" event handler
    */
    const doFilter = () => {
            setFormDataField('offset',0);
            browserInfo.offset = 0;
            let operation = '';
            browserInfo.filter = [];
            if (formData.filterTypeName != '') {
                browserInfo.filter.push({
                    operation:operation,
                    relation:{field:'type_name', relType:'eq', value:formData.filterTypeName}
                });
                operation = 'and';
            }    
            if (formData.filterUnit != '') {
                browserInfo.filter.push({
                    operation:operation,
                    relation:{field:'unit', relType:'eq', value:formData.filterUnit}
                });
                operation = 'and';
            }    
            getItems('browser');
            return false;
    }

    /**
     * user click "del filter" event handler
     */
    const delFilter = () => {
            setFormDataField('filterTypeName','');
            setFormDataField('filterUnit','');
            browserInfo.filter = [];
            getItems('browser');
    }

    /**
     * form onload function
     */
    var runOnLoad = true;
    useEffect(() => {
        if (runOnLoad) {
            let i = 0;
            let filterField = '';
            // load dictionaries
            Translator.loadDictionaries('', dispatch);
            // load loged user info
            const s = Cookies.getCookie('work_loged');
            if (s >= '{') {
                user = JSON.parse(s);
            }
            // load browser info from cookie
            browserInfo = fm.getBrowserInfo(browserName);
            if ((browserInfo.order != 'type_name: asc') &&
                (browserInfo.order != 'unit: asc') &&
                (browserInfo.order != 'type_name: desc') &&
                (browserInfo.order != 'unit: desc')
            ) {
                 browserInfo.order = 'type_name: asc';   
            }
            // set filterForm filed from browserInfo
            for(i = 0; i < browserInfo.filter.length; i++) {
                filterField = browserInfo.filter[i].relation.fieldName;
                if (filterField == 'type_name') {
                    setFormDataField('filterTypeName', browserInfo.filter[i].realtion.value);    
                }
                if (filterField == 'unit') {
                    setFormDataField('filterUnit', browserInfo.filter[i].realtion.value);    
                }
            }

            // setup keyup handler
            document.addEventListener("keyup", keyUpHandler);
            //return () => {
            //  document.removeEventListener("keyup", keyUpHandler);
            //};

            if (id == '0') {
                getItems('browser');
            }
            if (id != '0') {
                getOneRecord(id, 'show');
            }
            runOnLoad = false;
        }    
    }, []);

    return (
                <div id="labelTypes" className={Styles.subPage}>
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
                    {(compStatus == 'loader') &&
                        <div className="loader">
                            <img src="/img/loader.gif" />
                        </div>
                    }
                    <br /><br />
                    {(compStatus == 'browser') && 
                        <div className="browser">
                            <h2>Resource lebel_type browser</h2>
                            <div className="col_d6_p12">
                                <div className={Styles.filterForm}>
                                <h3>{ t('FILTER')}</h3>
                                <form className="form">
                                    <div className="formControl">
                                        <label>{ t('type_name')}:</label>
                                        <input type="text" 
                                                name="filterTypeName"
                                                id="filterTypeName" 
                                                value={formData.filterTypeName}
                                                onChange={fm.handleInput}
                                                />
                                    </div>
                                    <div className="formControl">
                                        <label>{ t('unit')}:</label>
                                        <input type="text" 
                                                name="filterUnit"
                                                id="filterUnit" 
                                                value={formData.filterUnit}
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
                                        <th id="thtype_name" onClick={thClick} className={Styles.th}>
                                            <var dangerouslySetInnerHTML={{ __html: thIcon('type_name',formData.order) }}></var>
                                            { t('type_name') }</th>
                                        <th id="thunit" onClick={thClick} className={Styles.th}>
                                            <var dangerouslySetInnerHTML={{ __html: thIcon('unit',formData.order) }}></var>
                                            { t('unit') }</th>
                                        <th id="thcreated_at" onClick={thClick} className={Styles.th}>
                                            <var dangerouslySetInnerHTML={{ __html: thIcon('created_at',formData.order) }}></var>
                                            { t('created_at') }</th>
                                    </tr>    
                                </thead>
                                <tbody className="brBody">
                                { formData.items.map( (item: LabelTypeRecord, index) => 
                                    <tr key={index}>
                                        <td>
                                            <button type="button" title="edit" 
                                                onClick={() => getOneRecord(item.id,'edit')}>
                                                &#9997;</button>
                                            <button className="alert_danger" type="button" title="delete"
                                                onClick={() => getOneRecord(item.id,'delete') }>
                                                x</button>
                                            <button type="button" title="show"
                                                onClick={() => getOneRecord(item.id, 'show') }>
                                                &#9758;</button>
                                            { item.type_name }</td>
                                        <td>{ item.unit }</td>
                                        <td>{ item.created_at }
                                        </td>
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
                    {(compStatus == 'show') && 
                        <div className={Styles.show}>
                            <h2>{ t('label_types') }</h2>
                            <form className="form">
                                <div className="formControl">
                                    <label>{ t('id')}:</label>
                                    <strong>#{ formData.id }</strong>
                                </div>
                                <div className="formControl">
                                    <label>{ t('type_name')}:</label>
                                    { formData.type_name }
                                </div>
                                <div className="formControl">
                                    <label>{ t('unit')}:</label>
                                    { formData.unit }
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
                    {(compStatus == 'edit') && 
                        <div className="edit">
                            <h2>{ t('label_types') }</h2>
                            {( formData.id == '') && <h2>{ t('new')}</h2>}
                            {( formData.id != '') && <h2>{ t('edit')}</h2>}
                            <form className="form">
                                <div className="formControl">
                                    <label>{ t('id')}:</label>
                                    <strong>#{ formData.id }</strong>
                                </div>
                                <div className="formControl">
                                    <label>{ t('type_name')}:</label>
                                    <input type="text" 
                                            name="type_name"
                                            id="type_name" 
                                            value={formData.type_name}
                                            onChange={fm.handleInput}
                                            />
                                </div>
                                <div className="formControl">
                                    <label>{ t('unit')}:</label>
                                    <input type="text" 
                                            name="unit"
                                            id="unit" 
                                            value={formData.unit}
                                            onChange={fm.handleInput}
                                            />
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
                    {(compStatus == 'delete') && 
                        <div className={Styles.deleteForm}>
                            <h2>{formData.type_name}</h2>
                            <div>{ formData.unit }</div>
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
                                    onClick={ () => setCompStatus('browser') }>
                                    { t('cancel') }                                            
                                </button>
                            </div>    
                        </div>
                    }   
                </div>
    );
};

const LabelTypes = ( params: any ) => {
    return SiteLayout({
        PageContent: () => { return _LabelTypes(params);}
    });
}
export default LabelTypes;
