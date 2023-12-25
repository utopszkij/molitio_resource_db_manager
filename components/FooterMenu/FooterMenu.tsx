import React from 'react';
import styles from './FooterMenu.module.scss';
import { Translator, t } from '../Translator';
import { selectTranslatorData, useAppSelector } from '../../context/store';

export default function FooterMenu(): React.JSX.Element {
    Translator.translatorData = useAppSelector(selectTranslatorData);
    return (
        <div id="FooterMenu" className={styles.footermenu}>
            <nav id="nav" className={styles.nav}>
                <h2>{ t('QUICK_LINKS') }</h2>
                <ul>
                    <li>
                        <a href="home" target="_self">
                            { t('home') }
                        </a>
                    </li>
                    <li>
                        <a href="about" target="_self">
                            { t('about_us') }
                        </a>
                    </li>
                    <li>
                        <a href="contact" target="_self">
                            { t('contact') }
                        </a>
                    </li>
                    <li>
                        <a href="terms" target="_self">
                            { t('ASZF') }
                        </a>
                    </li>
                    <li>
                        <a href="policy" target="_self">
                            { t('POLICY') } 
                        </a>
                    </li>
                    <li>
                        <a href="faq" target="_self">
                            { t('FAQ') } 
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
