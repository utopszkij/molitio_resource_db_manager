'use client';
/**
 * resource_label_type manager React component
 * url param: id
 * - id == 0  borwserInfo from cookie, browser
 * - id != '' browserInfo clear, show
 */

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
// browser    
import { BrowserInfo, fm } from '../../objects/FormManager';
// paginator support
import { Paginator } from '../../objects/Paginator';
// controller
import { LabelTypeController, FormData } from './LabelTypesController';
import { Record } from './LabelTypesModel';

const ctrl = new LabelTypeController();

/**
* resources_label_types manager REACT component
* For the form input to work, it must be a top-level component. 
* Therefore, it cannot be defined in the siteLayout parameter!
*/
const _LabelTypes = ( params: any ): React.JSX.Element => {
    
    // top level codes runs after each formData modification !!!
    
    const browserName = 'labelTypes';
    const dispatch = useAppDispatch();
    let id = params.id;

    let record:Record = {
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
        compStatus: '',
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

    const getFormData = ():FormData => {
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
            ctrl.onLoad(id,setFormDataField, getFormData);
            runOnLoad = false;
        }    
    }, []);

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

    // ======================== event handlers ===================================
    
    /**
     * errorMsg or successmsg close btn click event handler
     */
    const msgCloseBtnClick = () => {
        fm.clearMsgs();
    }

    /**
     * cancel click event handler
     */
    const cancelClick = () => {
        ctrl.browser();
    }

    /**
     * show button click event handler
     * @param id 
     */
    const showClick = (id: string) => {
        ctrl.show(id);
    }    

    /**
     * new button click event handler
     */
    const newClick = () => {
        ctrl.new();
    }

    const saveClick = () => {
        ctrl.save()
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
                    document.getElementById('doFilter')?.click()    
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
     * @param e Event   target.id is paginatorType 
     */
    const paginatorClick = (e:any) => {
        const id = e.target.id;
        ctrl.doPaginator(id);
    }

    /**
     * user click table header event handler --> reOrder
     * @param e 
    */
    const thClick = (e:any) => {
        const name = e.target.id.substring(2,100);
        ctrl.reOrder(name);
    }    

    /**
     * user click formFilter "start" event handler
    */
    const doFilter = () => {
        ctrl.doFilter();
    }

    /**
     * user click "del filter" event handler
     */
    const delFilter = () => {
        ctrl.delFilter();
    }

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
                    <div id="waiting"></div>
                    <br /><br />
                    {(formData.compStatus == 'browser') && 
                        <div className="browser">
                            <h2>{ t('labelTypes') }</h2>
                            <div className="col_d6_p12">
                                <div className={Styles.filterForm}>
                                <h3>{ t('FILTER')}</h3>
                                <form className="form">
                                    <div className="formControl">
                                        <label>{ t('name')}:</label>
                                        <input type="text" 
                                                name="filterTypeName"
                                                id="filterTypeName" 
                                                value={formData.filterTypeName}
                                                onChange={fm.handleInput}
                                                />
                                    </div>
                                    <div className="formControl">
                                        <label>{ t('unit')} :</label>
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
                                    {(window?.innerHeight < 600) &&
                                    <tr><th>{ t('SORT') }</th></tr>
                                    }
                                    <tr>
                                        <th className={Styles.thButtons}></th>
                                        <th id="thtype_name" onClick={thClick} className={Styles.th}>
                                            <var onClick={() => ctrl.reOrder('type_name')}
                                                 dangerouslySetInnerHTML={{ __html: thIcon('type_name',formData.order) }}></var>
                                            { t('type_name') }</th>
                                        <th id="thunit" onClick={thClick} className={Styles.th}>
                                            <var onClick={() => ctrl.reOrder('unit')}
                                                 dangerouslySetInnerHTML={{ __html: thIcon('unit',formData.order) }}></var>
                                            { t('unit') }</th>
                                        <th id="thcreated_at" onClick={thClick} className={Styles.th}>
                                            <var onClick={() => ctrl.reOrder('created_at')}
                                                 dangerouslySetInnerHTML={{ __html: thIcon('created_at',formData.order) }}></var>
                                            { t('created_at') }</th>
                                    </tr>    
                                </thead>
                                <tbody className="brBody">
                                { formData.items.map( (item: Record, index) => 
                                    <tr key={index}>
                                        <td>
                                            <button type="button" title="edit" 
                                                onClick={() => ctrl.getOneRecord(item.id,'edit')}>
                                                &#9997;</button>
                                            <button className="alert_danger" type="button" title="delete"
                                                onClick={() => ctrl.getOneRecord(item.id,'delete') }>
                                                x</button>
                                            <button type="button" title="show"
                                                onClick={() => ctrl.getOneRecord(item.id, 'show') }>
                                                &#9758;</button>
                                        </td>
                                        <td>        
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
                                      <button type="button" className="btn" onClick={() => {ctrl.getItems('browser',item)}}>
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
                                <button type="button" id="newBtn" className="btn" onClick={newClick} title="new">
                                    +{ t('new') }
                                </button>
                            </div>
                        </div>

                    }   
                    {(formData.compStatus == 'show') && 
                        <div className={Styles.show}>
                            <h2>{ t('labelType') }</h2>
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
                    {(formData.compStatus == 'edit') && 
                        <div className="edit">
                            <h2>{ t('labelType') }</h2>
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
                                    <button type="button" id="saveBtn" className="btn_ok" onClick={ saveClick }>
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
                            <h2>{formData.type_name} label_type </h2>
                            <div>{ formData.unit }</div>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>
                            <h3>{ t('deleteTitle') } ?</h3>
                            <div>&nbsp;</div>
                            <div>
                                <strong>{ t('deleteWarning') }</strong>
                            </div>
                            <div>&nbsp;</div>
                            <div className="formButtons">
                                <button type="button" className="btn_danger"
                                    onClick={ () => ctrl.doDelete(formData.id) }>
                                    { t('delete') }                                            
                                </button>
                                &nbsp;
                                <button type="button" className="btn_primary"
                                    onClick={ () => ctrl.browser() }>
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
