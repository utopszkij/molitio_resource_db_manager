import React from 'react';
import { SiteLayout } from '../SiteLayout';
import styles from '../SiteLayout/SiteLayout.module.scss';

const Contact: React.FC = () => {
    return SiteLayout({
        PageContent: () => {
            return (
                <div id="contact">
                    <div>
                        <div className={styles.subPage}>
                            <img src="/img/bg2.jpg" className={styles.decorImg} />
                            <h2>Kapcsolat</h2>
                            <p>
                                <em>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum.
                                </em>
                            </p>
                            <p>
                                <img src="/img/email.png" className={styles.logo} />
                                <a href="mailto::info.molitio.com">Levél írása</a>
                            </p>
                        </div>
                    </div>
                </div>
            );
        },
    });
};
export default Contact;
