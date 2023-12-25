import { SiteLayout } from '../SiteLayout';
import styles from '../SiteLayout/SiteLayout.module.scss';

const Terms: React.FC = () => {
    return SiteLayout({
        PageContent: () => {
            return (
                <div className={styles.subPage} id="terms">
                    <img src="/img/bg1.jpg" className={styles.decorImg} />
                    <h2>Felhasználási feltételek</h2>
                    <p>
                        <em>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </em>
                    </p>
                </div>
            );
        },
    });
};
export default Terms;
