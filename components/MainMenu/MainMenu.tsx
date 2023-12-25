import { useState } from 'react';
import { useEffect } from 'react';
import { Translator, t } from '../Translator';
import styles from './MainMenu.module.scss';
import { selectTranslatorData, useAppSelector } from '../../context/store';


const MainMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState('0');
    const translatorData = useAppSelector(selectTranslatorData);
    Translator.translatorData = translatorData;

    const toggle = () => {
        if (isOpen == '-1') {
            setIsOpen('2');
        } else {
            setIsOpen('-1');
        }
    };

    const onload = () => {
        if (window.innerWidth < 800) {
            setIsOpen('-1');
        } else {
            setIsOpen('1');
        }
    };

    useEffect(() => {
        window.addEventListener('resize', onload);
        onload();
    }, []);

    return (
        <div id="MainMenu" className={styles.mainmenu}>
            <a href="home">
                <img src="/img/logo.png" className={styles.logo} />
            </a>
            <nav id="nav" className={styles.nav} style={{ zIndex: `${isOpen}` }}>
                <strong>Resources_schema</strong><br />
                <ul>
                    <li>
                        <a href="/home" target="_self">
                            {t('home')}
                        </a>
                    </li>
                    <li>
                        <a href="/0/communities" target="_self">
                            {t('communities')}
                        </a>
                    </li>
                    <li>
                        <a href="/0/collections" target="_self">
                            {t('collections')}
                        </a>
                    </li>
                    <li>
                        <a href="/0/resources" target="_self">
                            {t('resources')}
                        </a>
                    </li>
                    <li>
                        <a href="/0/labeltypes" target="_self">
                            {t('labelTypes')}
                        </a>
                    </li>
                    <li>
                        <a href="login" target="_self">
                            {t('login/regist')}
                        </a>
                    </li>
                </ul>
            </nav>
            <button type="button" onClick={toggle} className={styles.toggler}>
                {/* Menu icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                    <path fill="#fff" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z" />
                </svg>
            </button>
        </div>
    );
};
export default MainMenu;
