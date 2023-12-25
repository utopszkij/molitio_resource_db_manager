'use client'
import React from 'react';
import { useEffect } from 'react';
import {getCookie } from 'cookies-next';
import {Cookies } from './Cookies';
import styles from './CookieConsent.module.scss';
import {setCookieConsentData, selectCookieConsentData,
        useAppDispatch, useAppSelector,
        } from '../../context/store';
import { CookieConsentData } from '../../context/types';

/**
 * Cookie consent form
 * Cookie name convention:
 * category_name
 *      where category: 'work' | 'statistics' | 'marketing' | 'customize'
 * Cookie consent in cookie:
 *      work_work_enabled, work_statistics_enabled, work_marketing_enabled, work_customize_enabled
 *      work_checked
 *
 * cookie consent form REACT component
 * you need a "policy" URL root that contains the data management description
 * reurn REACT.FC
 */
const CookieConsentDisplay:React.FC = () => {
    // conect data from Redux
    const cookieConsentData: CookieConsentData = useAppSelector(selectCookieConsentData);
    // conector for Redux data manipulation
    const dispatch = useAppDispatch();

    // data for form and init from cookieConsentData
    const [formData, setFormData] = React.useState({
        workEnabled: true,
        statisticEnabled: cookieConsentData.statisticEnabled,
        marketEnabled: cookieConsentData.marketEnabled,
        customizeEnabled: cookieConsentData.customizeEnabled
    });

    /**
     * set one filed in formData
     * @param fname mező neve
     * @param value érték
     */
    const setFormDataField = (fname: string, value: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [fname]: value,
        }));
    };

    /**
     * form change event handler
     * @param e HTML event
     */
    const handleInput = (e: any) => {
        let nodeName = e.target.nodeName;
        let fieldValue: any = '';
        if (nodeName == 'INPUT') {
            let type = e.target.type;
            if (type == 'checkbox') {
                fieldValue = e.target.checked;
            } else if ((type = 'radio')) {
                fieldValue = e.target.selected;
            } else {
                fieldValue = e.target.value;
            }
        }
        if (nodeName == 'SELECT') {
            fieldValue = e.target.options[e.target.selectedIndex].value;
        }
        if (nodeName == 'TEXTAREA') {
            fieldValue = e.target.innerHTML;
        }

        const fieldName = e.target.name;
        setFormDataField(fieldName, fieldValue);
    };

    /**
     * event handler for save click
     * @return void
     */
    function saveClick() {
        dispatch(setCookieConsentData({
            checked: true,
            workEnabled: formData.workEnabled,
            statisticEnabled: formData.statisticEnabled,
            marketEnabled: formData.marketEnabled,
            customizeEnabled: formData.customizeEnabled
        }));
    }

    /**
     * event handler for all enabled click
     * @return void
     */
    function allEnabledClick() {
        dispatch(setCookieConsentData({
            checked: true,
            workEnabled: true,
            statisticEnabled: true,
            marketEnabled: true,
            customizeEnabled: true
        }));
        setFormDataField('workEnabled',true);
        setFormDataField('statisticEnabled',true);
        setFormDataField('marketEnabled',true);
        setFormDataField('customizeEnabled',true);
    }

    /**
     * event handler for all disabled click
     * @return void
     */
    function delAllClick() {
        dispatch(setCookieConsentData({
            checked: true,
            workEnabled: false,
            statisticEnabled: false,
            marketEnabled: false,
            customizeEnabled: false
        }));
        setFormDataField('workEnabled',false);
        setFormDataField('statisticEnabled',false);
        setFormDataField('marketEnabled',false);
        setFormDataField('customizeEnabled',false);
    }

    /**
     * event handler for cancel click
     * @return void
     */
    function cancelClick() {
        dispatch(setCookieConsentData({
            checked: true,
            workEnabled: cookieConsentData.workEnabled,
            statisticEnabled: cookieConsentData.statisticEnabled,
            marketEnabled: cookieConsentData.marketEnabled,
            customizeEnabled: cookieConsentData.customizeEnabled
        }));
    }

    return (
        <div  className={styles.dialog} id="cookieDlg">
            <button className={styles.btnCancel} onClick={cancelClick}>
                X
            </button>
            <h2>Süti (cookie) kezelés</h2>
            <p>A "süti" (cookie) az Ön számítógépén, elkülönített helyen tárolt kisméretű adategység.</p>
            <p>
                Web oldalunk - a legtöbb web oldalhoz hasonlóan - un. "munkamenet sütiket" (cookie -kat) használ az
                interaktiv munkamenet megszervezésére és a felhasználói élmény növelésére.
                Ez feltétlenül szükséges a weboldal használatához.
            </p>
            <p>
                Továbbá - ha ön ezt jóváhagyja - statisztikai, kereskedelmi(reklám testreszabás) és program
                testreszabási funkciók is használhatnak sütiket.
            </p>
            <p>
                <a href="policy">Részletes tájékozatót lásd itt</a>
            </p>
            <p>
                <input
                    type="checkbox"
                    id="workEnabled"
                    name="workEnabled"
                    checked={formData.workEnabled}
                    onChange={handleInput}
                />
                Munkamenet
                <br />
                <input
                    type="checkbox"
                    id="statisticEnabled"
                    name="statisticEnabled"
                    checked={formData.statisticEnabled}
                    onChange={handleInput}
                />
                Statisztika
                <br />
                <input
                    type="checkbox"
                    id="marketEnabled"
                    name="marketEnabled"
                    checked={formData.marketEnabled}
                    onChange={handleInput}
                />
                Marketing (reklám testreszabás)
                <br />
                <input
                    type="checkbox"
                    id="customizeEnabled"
                    name="customizeEnabled"
                    checked={formData.customizeEnabled}
                    onChange={handleInput}
                />
                Program testreszabás
                <br />
            </p>
            <p>&nbsp;</p>
            <p>
                <button className="btn_primary" onClick={allEnabledClick}>
                    Összest engedélyez
                </button>
                &nbsp;
                <button className="btn_secondary" onClick={saveClick}>
                    Bejelölteket engedélyez
                </button>
                &nbsp;
                <button className="btn_danger" onClick={delAllClick}>
                    Mindent tilt
                </button>
                &nbsp;
            </p>
        </div>
    );
};

const CookieConsent: React.FC = () => {
    const cookieConsentData: CookieConsentData = useAppSelector(selectCookieConsentData);
    const dispatch = useAppDispatch();

    /**
     * form onload event habdler
     * - get redux data from cookie 
    */
    useEffect(() => {
        dispatch(setCookieConsentData({
            checked: (getCookie('work_checked') == 'true'),
            workEnabled: (getCookie('work_work_enabled') == 'true'),
            statisticEnabled: (getCookie('work_statistic_enabled') == 'true'),
            marketEnabled: (getCookie('work_market_enabled') == 'true'),
            customizeEnabled: (getCookie('work_customize_enabled') == 'true') 
        }));
    }, []);

    if (cookieConsentData.checked) {
        return <></>
    } else {
        return (
            <CookieConsentDisplay />
        );
    }
}

export default CookieConsent;
