'use client';
/**
 * community' members manager
 *  URL param: id
 * - id == '0'   load browserInfo from cookie, browser
 * - id > 0      and id community'id then set browserInfo community_id = id, browser
 * - id > 0      then show
 */
import React, { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { SiteLayout } from '../SiteLayout';
import Styles from './Members.module.scss';
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
import { insert, update, getRecords, getTotal, getRecord, 
    remove, removeRecords, preprocessor} from '../../objects/DatabaseInterface';
// form manager support
import { BrowserInfo, fm } from '../../objects/FormManager';
// paginator support
import { Paginator } from '../../objects/Paginator';
/**
 * Collection record
 */
export type MembersRecord = {
    id: string,
    type: string,
    resource_community_id: string,
    description: string,
    status: string,
    owner: string,
    created_by: string,
    created_at: string,
    updated_by: string,
    updated_at: string,
    resource_community:{name: string}
}

/**
* resources collection manager REACT component
* For the form input to work, it must be a top-level component. 
* Therefore, it cannot be defined in the siteLayout parameter!
*/
const _Members = ( params: any ): React.JSX.Element => {
    // general data
    const browserName = 'members';
    const dispatch = useAppDispatch();
    const [compStatus, setCompStatus] = useState(''); // 'browser'|'show'|'edit'|'delete'|'none'
    let id = params.id;

    let record:MembersRecord = {
        id: '',
        type: 'public',    
        description: '',
        status: '',
        owner: '',
        created_at: '',
        created_by: '',
        updated_by: '',
        updated_at: '',
        resource_community_id : id,
        resource_community: {name:''}
    } 

    // test user data, must overwrite it!
    let user:AuthenticatedUser = fm.testUser

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
        parentId: id,
        parentName: '',
        // data form
        id: record.id,
        type: record.type,
        description: record.description,
        status: record.status,
        owner: '',
        created_by: record.created_by,
        creatorName: '',
        created_at: record.created_at,
        updated_by: record.updated_by,
        updaterName: '',
        updated_at: record.updated_at,
        resource_community_id : id,
        resource_community: {name:''},
        // filter form
        filterName: '',
        filterDescription: '',
        filterStatus: '',
        // browser
        offset:0,
        order:'name: asc',
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
                    type : formData.type,
                    description : formData.description,
                    status : formData.status,
                    resource_community_id: formData.parentId,
                    created_at : fm.getCurrentDate(),
                    created_by : user.id,
                } 
                insert('resource_schema','resource_collection', record)
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
                    type : formData.type,
                    description : formData.description,
                    status : formData.status,
                    created_at : formData.created_at,
                    created_by : formData.created_by,
                    resource_community_id : formData.resource_community_id,
                    updated_at : fm.getCurrentDate(),
                    updated_by : user.id,
                } 
                update('resource_schema','resource_collection',record.id, record)
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
        getItems('browser');
    }

    /**
     * form data validator
     * @returns string
     */
    const validator = (): string => {
        fm.clearMsgs();
        let result = '';
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
            if (newOffset < 0) newOffset = 0;
            if (newOffset >= formData.total) newOffset = 0;
            browserInfo.offset = newOffset;
            setFormDataField('offset',newOffset);
        }
        if (formData.parentId > '0') {
            browserInfo.filter[0] = {
                operation:'',
                relation:{
                    field:'resource_community_id',
                    relType:'eq',
                    value: formData.parentId
                }
            };
        } else {
            browserInfo.filter[0] = {
                operation:'',
                relation:{
                    field:'resource_community_id',
                    relType:'neq',
                    value: user.id
                }
            };
        }
        getRecords('public_user_schema', 'public_user_community',
            ['id','created_at',
              'user_creator.username_public', 'user_modifier.username_public',
              'resource_community.name','user_public_id' ], 
            [browserInfo.order], 
            browserInfo.filter,
            browserInfo.offset,
            browserInfo.limit
        ).then( (res) => { 
            res = preprocessor(res);
            if (res.error != undefined) {
                fm.setErrorMsg(res.error);
            } else {
                let i = 0;
                for (i = 0; i < res.length; i++) {
                    res[i].type = 'public';
                }
                setFormDataField('items',res);
                getRecords('private_user_schema', 'private_user_community',
                ['id','created_at',
                  'user_creator.username_public', 'user_modifier.username_public',
                  'resource_community.name', 'user_public_id' ], 
                [browserInfo.order], 
                browserInfo.filter,
                browserInfo.offset,
                browserInfo.limit
                ).then ( (res) => {
                    let i = 0;
                    for (i = 0; i < res.length; i++) {
                        res[i].type = 'private';
                    }
                    setFormDataField('items', formData.items.concat(res));
                    setFormDataField('order',browserInfo.order);
                    setFormDataField('offset',browserInfo.offset);
                    fm.saveBrowserInfo(browserInfo);
                    getTotalCount(newStatus);
                })

            }   
        })        

    }

    /**
     * get total record count from database
     * @param newStatus 
     */
    const getTotalCount = (newStatus: string) => {
        getTotal('public_user_schema', 'public_user_community',
            browserInfo.filter
        ).then( (res) => { 
            res = preprocessor(res);
            if (res.error != undefined) {
                fm.setErrorMsg(res.error);
            } else {
                setFormDataField('total',res.count);
                getTotal('public_user_schema', 'public_user_community',
                browserInfo.filter
                ).then( (res) => { 
                    setFormDataField('total',(formData.total + res.count));
                    setFormDataField('pages',Paginator.buildPages(formData.total, browserInfo.limit));
                    setCompStatus(newStatus);
                })    
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
        getRecord('resource_schema', 'resource_collection',
            ['id','name','description','status','created_at','created_by',
              'updated_at','updated_by',  'resource_community_id',
              'user_creator.username_public', 'user_modifier.username_public',
              'resource_community.name' ], 
            id  
        ).then( (res) => { 
            res = preprocessor(res);
            if (res.error != undefined) {
                fm.setErrorMsg(res.error);
            } else {
                if (res.length > 0) {
                    setFormDataField('id',res[0].id);
                    setFormDataField('name',res[0].name);
                    setFormDataField('description',res[0].description);
                    setFormDataField('status',res[0].status);
                    setFormDataField('resource_community_id',res[0].resource_community_id);
                    setFormDataField('resource_community',res[0].resource_community);
                    setFormDataField('created_at',res[0].created_at);
                    setFormDataField('updated_at',res[0].updated_at);
                    setFormDataField('created_by',res[0].created_by);
                    setFormDataField('updated_by',res[0].updated_by);
                    setFormDataField('creatorName',res[0].user_creator.username_public);
                    setFormDataField('updaterName',res[0].user_modifier?.username_public);
                }    
                setCompStatus(newStatus);
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
        document.getElementById('name')?.setAttribute('class','');
        document.getElementById('description')?.setAttribute('class','');
        document.getElementById('status')?.setAttribute('class','');
        fm.clearMsgs();

        // formData init 
        setFormDataField('id','');
        setFormDataField('name','');
        setFormDataField('description','');
        setFormDataField('status','');
        setFormDataField('owner','');
        setFormDataField('created_at',fm.getCurrentDate());
        setFormDataField('created_by',user.id);
        setFormDataField('creatorName',user.nick);
        setFormDataField('resource_community_id',formData.parentId);
        setFormDataField('resource_community',{name: formData.parentName});
        // display edit form
        setCompStatus('edit');
        window.setTimeout("document.getElementById('name')?.focus()",1000);
    }

    /**
     * doDelete button click event handler
     * @param id 
     */
    const doDelete = (id: string) => {
        window?.scrollTo(0,0);
        setCompStatus('loader');
        remove('resource_schema','resource_collection', id)
        .then( (res) => {
            res = preprocessor(res);
            if (res.error != undefined) {
                fm.setErrorMsg(res.error);
            } else {    
                removeRecords('resource_schema','resource',
                    [{operator:'',
                    relation:{
                        field:'resource_id',
                        relType:'eq',
                        value:id
                    }
                    }]);
                removeRecords('resource_schema','table_label',
                    [{operator:'',
                    relation:{
                        field:'parent_id',
                        relType:'eq',
                        value:id
                    }},
                    {operator:'and',
                    relation:{
                        field:'parent_table',
                        relType:'eq',
                        value:'resorce_collection'
                    }},                  
                    ]);
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
                if ((e.target.id == 'filterName') ||
                    (e.target.id == 'filterDescription') ||
                    (e.target.id == 'filterStatus')) {
                    document.getElementById('doFilter')?.click()    
                }
                if ((e.target.id == 'name') ||
                    (e.target.id == 'status')) {
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
            if (id > '0') {            
                while (browserInfo.filter.length > 1) {
                    browserInfo.filter.splice(1,1);
                }
            } else {
                browserInfo.filter = [];
            }        

            if (formData.filterName != '') {
                browserInfo.filter.push({
                    operation:operation,
                    relation:{field:'name', relType:'eq', value:formData.filterName}
                });
                operation = 'and';
            }    
            if (formData.filterStatus != '') {
                browserInfo.filter.push({
                    operation:operation,
                    relation:{field:'status', relType:'eq', value:formData.filterStatus}
                });
                operation = 'and';
            }    
            if (formData.filterDescription != '') {
                browserInfo.filter.push({
                    operation:operation,
                    relation:{field:'description', relType:'like', value:'%'+formData.filterDescription+'%'}
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
            setFormDataField('filterName','');
            setFormDataField('filterDescription','');
            setFormDataField('filterStatus','');
            if (id > '0') {            
                while (browserInfo.filter.length > 1) {
                    browserInfo.filter.splice(1,1);
                }
            } else {
                browserInfo.filter = [];
            }        
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

            // setup keyup handler
            document.addEventListener("keyup", keyUpHandler);

            // get parentName  from database
            if (formData.parentId > '0') {
                getRecord('resource_schema','resource_community',['name'], formData.parentId)
                .then( (res) => {
                    res = preprocessor(res);
                    if (res.length > 0) {
                        // community id jött au url -ből
                        browserInfo.filter = [{
                            operator:'',
                            relation:{
                                field:'resource_community',
                                resType:'eq',
                                value: formData.parentId
                            }
                        }];
                        setFormDataField('parentName',res[0].name);
                        getItems('browser');
                    } else {
                        browserInfo.filter = [];
                        // collectionId jött az url -ből
                        getOneRecord(formData.parentId, 'show');
                        // community olvasása
                        getRecord('resource_schema','resource_collection',
                            ['resource_community_id','resource_community.name'], formData.parentId)
                        .then ((res) => {
                            res = preprocessor(res);
                            if (res.error != undefined) {
                                fm.setErrorMsg(res.error);
                            } else {
                                setFormDataField('parentId',res[0].resource_community_id);
                                setFormDataField('parentName', res[0].resource_community.name);
                            }
                        })    
                    }    
                })
            } else {
                // set filterForm filed from browserInfo
                for(i = 0; i < browserInfo.filter.length; i++) {
                    filterField = browserInfo.filter[i].relation.fieldName;
                    if ((filterField == 'name') ||
                        (filterField == 'description') ||
                        (filterField == 'staus')) {
                        filterField = filterField.substring(0,1).toUpperCase() +
                                    filterField.substring(1,100);  
                        setFormDataField('filter'+filterField, browserInfo.filter[i].realtion.value);    
                    }   
                }
                setFormDataField('parentName','');
                getItems('browser');
            }
            runOnLoad = false;
        }    
    }, []);

    return (
                <div id="collections" className={Styles.subPage}>
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
                    { (formData.parentId > '0') &&
                    <h2>
                        <a href={ '/'+formData.parentId+'/communities'} className={Styles.parentLink}>
                            &#9758;{ formData.parentName }</a></h2>
                    }        
                    <br />
                    {(compStatus == 'browser') && 
                        <div className="browser">
                            <h2>{ t('collections') }</h2>
                            <div className="col_d6_p12">
                                <div className={Styles.filterForm}>
                                <h3>{ t('FILTER')}</h3>
                                <form className="form">
                                    <div className="formControl">
                                        <label>{ t('name')}:</label>
                                        <input type="text" 
                                                name="filterName"
                                                id="filterName" 
                                                value={formData.filterName}
                                                onChange={fm.handleInput}
                                                />
                                    </div>
                                    <div className="formControl">
                                        <label>{ t('description')} {t('SUBSTRING')}:</label>
                                        <input type="text" 
                                                name="filterDescription"
                                                id="filterDescription" 
                                                value={formData.filterDescription}
                                                onChange={fm.handleInput}
                                                />
                                    </div>
                                    <div className="formControl">
                                        <label>{ t('status')}:</label>
                                        <input type="text" 
                                                name="filterStatus"
                                                id="filterStatus" 
                                                value={formData.filterStatus}
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
                                        <th id="thresource_community.name" onClick={thClick} className={Styles.th}>
                                            <var dangerouslySetInnerHTML={{ __html: thIcon('resource_community.name',formData.order) }}></var>
                                            { t('parentName') }</th>
                                        <th id="thname" onClick={thClick} className={Styles.th}>
                                            <var dangerouslySetInnerHTML={{ __html: thIcon('name',formData.order) }}></var>
                                            { t('name') }</th>
                                        <th id="thdescription" onClick={thClick} className={Styles.th}>
                                            <var dangerouslySetInnerHTML={{ __html: thIcon('description',formData.order) }}></var>
                                            { t('description') }</th>
                                        <th id="thstatus" onClick={thClick} className={Styles.th}>
                                            <var dangerouslySetInnerHTML={{ __html: thIcon('status',formData.order) }}></var>
                                            { t('status') }</th>
                                        <th id="thcreated_at" onClick={thClick} className={Styles.th}>
                                            <var dangerouslySetInnerHTML={{ __html: thIcon('created_at',formData.order) }}></var>
                                            { t('created_at') }</th>
                                    </tr>    
                                </thead>
                                <tbody className="brBody">
                                { formData.items.map( (item: MembersRecord, index) => 
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
                                            { item.resource_community.name }</td>
                                        <td>{ item.type }</td>    
                                        <td>{ item.description.substring(0,60) }</td>
                                        <td>{ item.status }</td>
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

                            {(formData.parentId > '0') &&
                            <div className={Styles.browserButtons}>
                                <button type="button" className="btn" onClick={newClick} title="new">
                                    +{ t('new') }
                                </button>
                            </div>
                            }
                        </div>

                    }   
                    {(compStatus == 'show') && 
                        <div className={Styles.show}>
                            <h2>{ formData.type }</h2>
                            <h3>{ t('collection') }</h3>
                            <a href={ '/resource_collection.'+formData.id+'/labels' } 
                                className="btn_primary">&#9758;{ t('labels') }</a> &nbsp;
                            <a href={ '/'+formData.id+'/resources'} 
                                className="btn_primary">&#9758;{ t('resources') }</a> &nbsp;
                            <br /><br />
                            <form className="form">
                                <div className="formControl">
                                    <label>{ t('id')}:</label>
                                    <strong>#{ formData.id }</strong>
                                </div>
                                <div className="formControl">
                                    <label>{ t('description')}:</label>
                                    <textarea 
                                            name="description"
                                            id="description"
                                            readOnly={true}
                                            value={formData.description}></textarea>

                                </div>
                                <div className="formControl">
                                    <label>{ t('status')}:</label>
                                    { formData.status }
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
                                    <button type="button" className="btn_cancel" onClick={delFilter}>
                                        &#8617;{ t('ok') }
                                    </button>
                                </div>
                            </form>
                        </div>
                    }   
                    {(compStatus == 'edit') && 
                        <div className="edit">
                            <h2>{ t('collection') }</h2>
                            {( formData.id == '') && <h2>{ t('new')}</h2>}
                            {( formData.id != '') && <h2>{ t('edit')}</h2>}
                            <form className="form">
                                <div className="formControl">
                                    <label>{ t('id')}:</label>
                                    <strong>#{ formData.id }</strong>
                                </div>
                                <div className="formControl">
                                    <label>{ t('parentName')}:</label>
                                    <strong>{ formData.resource_community.name }</strong>
                                </div>
                                <div className="formControl">
                                    <label>{ t('name')}:</label>
                                    <input type="text" 
                                            name="name"
                                            id="name" 
                                            value={formData.type}
                                            onChange={fm.handleInput}
                                            />
                                </div>
                                <div className="formControl">
                                    <label>{ t('description')}:</label>
                                    <textarea 
                                            name="description"
                                            id="description"
                                            value={formData.description}
                                            onChange={fm.handleInput}></textarea>
                                </div>
                                <div className="formControl">
                                    <label>{ t('status')}:</label>
                                    <input type="text" 
                                            name="status"
                                            id="status" 
                                            value={formData.status}
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
                            <h2>{formData.type}</h2>
                            <div>{ formData.description}</div>
                            <div>&nbsp;</div>
                            <div>{ t('status') }: {formData.status} </div>
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
                    <div>
                        <br /><br />
                        <a className="btn_secondary" href={"/0/communities"}>
                                            &#8617;{ t('communities') }
                        </a>
                    </div>
                </div>
    );
};

const Members = ( params: any ) => {
    return SiteLayout({
        PageContent: () => { return _Members(params);}
    });
}
export default Members;
