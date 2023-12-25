'use client';
/**
 * egy adott oldal megjelenítése
 */
import React from 'react';
import { useEffect } from 'react';
import { SiteLayout } from '../SiteLayout';
import Styles from './HomePage.module.scss';
import { Flags, Translator, t } from '../Translator';
import { selectTranslatorData, useAppDispatch, useAppSelector } from '../../context/store';
import { TranslatorDataType } from '../../context/types';        

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const translatorData: TranslatorDataType = useAppSelector(selectTranslatorData);
    Translator.translatorData = translatorData;

    useEffect(() => {
        Translator.loadDictionaries('homePage', dispatch);
    }, []);

    return SiteLayout({
        PageContent: () => {
            return (
                <div id="homePage" className={Styles.subPage}>
                    <Flags />
                    <div id="primary">
                        <img src="img/db.png" className={Styles.dbImg} />
                    </div>
                    <div id="video-bottom" className={`${Styles.videoBottom} logo-line`}>
                        &#9662;&nbsp; &#9662;&nbsp; &#9662;&nbsp;
                        <img src="/img/logo.png" className={Styles.videoBottomImg} />
                        &nbsp; &#9662;&nbsp; &#9662;&nbsp; &#9662;&nbsp;
                    </div>
                    <div id="home-section" className={`${Styles.homeSection}`}>
                        <div className={Styles.homeCol}>
                            <h2>Molitio</h2>
                            <h3>{t('organization')}</h3>
                            {t('visio')}
                            <br />
                            <div className={Styles.buttons}>
                                <div className={Styles.homeButton}>
                                    <a href="services">{t('services')}</a>
                                </div>
                                <div className={Styles.homeButton}>
                                    <a href="about">{t('about_us')}</a>
                                </div>
                                <div className={Styles.homeButton}>
                                    <a href="team">{t('our_team')}</a>
                                </div>
                            </div>
                        </div>
                        <div className={Styles.homeCol}>
                            <h2>{t('expertise')}</h2>
                            {t('slogen2')}
                            <h2>{t('Social commitment')}</h2>
                            {t('slogen3')}
                        </div>
                    </div>
                </div>
            );
        },
    });
};
export default Home;
