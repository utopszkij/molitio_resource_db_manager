'use client';
import React from 'react';
import FooterMenu from '../FooterMenu';
import styles from './Footer.module.scss';
import {setCookieConsentChecked, useAppDispatch} from '../../context/store';
import { Translator, t } from '../Translator';
import { selectTranslatorData, useAppSelector } from '../../context/store';


export default function Footer(): React.JSX.Element {
    // connector for Redux data manipulation
    const dispatch = useAppDispatch();
    // get data from Redux
    Translator.translatorData = useAppSelector(selectTranslatorData);
    
    /**
     * event handler for Cookie dialog button click 
     */
    function cookieDlg() {
        dispatch(setCookieConsentChecked(false));
    }

    return (
        <div id="pageFooter" className={styles.footer}>
            <div>
                <div className={styles.logoLine}>
                    <img src="/img/logo.png" className={styles.logo} />
                </div>
                <div className={styles.footerLine}>&nbsp;</div>
                <div>
                    <div className={styles.leftBar}>
                        <FooterMenu />
                    </div>
                    <div className={styles.rightBar}>
                        <h2>{ t('IMPRESSUM') }</h2>
                        { t('ADRESS1') }<br />
                        { t('ADRESS2') }
                        <br />
                        { t('COUNTRY') }<br />
                        <strong>{ t('PHONE') }:</strong> +1 5589 55488 55
                        <br />
                        <strong>Email:</strong> info@example.com
                        <br />
                        <h2>{ t('USE_OPEN_SOURCE') }</h2>
                        nextjs, react, typescript, javascript, hasura
                    </div>
                </div>
                <div className={styles.socialLine}>
                    <h2>{ t('FOLLOW_US') }</h2>
                    <div className={styles.footerSocialLinks}>
                        <a href="#" className={styles.twitter}>
                            <img src="/img/twitter_logo.png" />
                        </a>
                        <a href="#" className={styles.facebook}>
                            <img src="/img/facebook_logo.png" />
                        </a>
                        <a href="#" className={styles.github}>
                            <img src="/img/github_logo.png" />
                        </a>
                    </div>
                </div>
                <div className={styles.cookieButton}>
                    <button id="cookieBtn" onClick={cookieDlg}>
                        { t('COOKIE_SETUP') }
                    </button>
                </div>
                <div> </div>
                <script
                    src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
                    crossOrigin="anonymous"
                ></script>
            </div>
        </div>
    );
}
