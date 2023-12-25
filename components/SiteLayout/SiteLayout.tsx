'use client';
// csináljuk együtt a layoutot
/**
 * Ez a web site megjelenités globális alap objektuma
 *
 * Licensz: GNU/GPL
 * Author: Tibor Fogler (utopszkij)
 *
 * REACT componensek esetenként a konkrét oldalkon átdefiniálhatóak
 *
 * PageJsTop       --body tetejébe beszúrandó js link
 * MainMenu        --mainmenü HTML
 * PageHeader      --lapfejléc HTML (rendszerint tartalmaz <Mainmenu /> elemet)
 * PageContent     --oldal tartalma HTML
 * PageSidebar1    --bal oldali oszlop HTML
 * PageSidebar2    --jobb oldali oszlop HTML
 * FooterMenu      --alsó menü HTML
 * PageFooter      --lábléc (rendszerint tartalmaz <Footermenu /> elemt)
 * PageJsBottom    --a body aljára elheylezendő js link
 *
 * Példa hassználatára egy page.tsx -ben:
 * - PageContent definiálása,
 * - PageHeader és PageSidebar1 átdefiniálása,
 * - a PageHeaderben a Layoutban definiált MainMenu -t használja
 *
 * import MinMenu from '../MainMenu';
 * import Layout from '../../app/SiteLayout';
 * export function Page1() {
 *   return Layout({
 *       PageHeader: () => {
 *          return
 *              (<div>Page header <Mainmenu /> mainmenu után i tartalom</div>)
 *       },
 *       PageContent: () => {
 *          return
 *              (<div>Page content</div>)
 *       },
 *       PageSidebar1: () => {
 *          return
 *              (<div>Page sidebar1</div>)
 *      }
 *   });
 * }
 */

import React from 'react'; // dinamikus oldalhoz kell ez
import Head from 'next/head';
import { MainMenu as DefaultMainMenu } from '../MainMenu';
import { Footer as DefaultFooter } from '../Footer';
import { SlideBarLeft as DefaultSideBarLeft, SlideBarRight as DefaultSideBarRight } from '../SlideBar';
import { CookieConsent as DefaultCookieConsent } from '../CookieConsent';
import styles from './SiteLayout.module.scss'; 

type JsxFunction = () => React.JSX.Element;

interface LayoutProps {
    MainMenu?: JsxFunction;
    FooterMenu?: JsxFunction;
    PageJsTop?: JsxFunction;
    PageJsBottom?: JsxFunction;
    PageHeader?: JsxFunction;
    PageContent?: JsxFunction;
    PageFooter?: JsxFunction;
    SlideBarLeft?: JsxFunction;
    SlideBarRight?: JsxFunction;
    CookieConsent?: JsxFunction;
}

export default function SiteLayout(props: LayoutProps): React.JSX.Element {


    function MainMenu(): React.JSX.Element {
       if (props.MainMenu != undefined) {
            return props.MainMenu()
        }
        return <DefaultMainMenu />
    }

    function PageJsTop(): React.JSX.Element {
        if (props.PageJsTop != undefined) {
            return props.PageJsTop()
        }
        return <></>
    }

    function PageHeader(): React.JSX.Element {
        if (props.PageHeader != undefined) {
            return props.PageHeader()
        }
        return (
            <div>
                <MainMenu />
            </div>
        )
    }

    function SlideBarLeft(): React.JSX.Element {
        if (props.SlideBarLeft != undefined) {
            return props.SlideBarLeft()
        } else {
            return <DefaultSideBarLeft />
        }
    }

    function SlideBarRight(): React.JSX.Element {
        if (props.SlideBarRight != undefined) {
            return props.SlideBarRight()
        } else {
            return <DefaultSideBarRight />
        }
    }

    function PageContent(): React.JSX.Element {
        if (props.PageContent != undefined) {
            return props.PageContent()
        }
        return <div>page content</div>
    }

    function PageFooter(): React.JSX.Element {
        if (props.PageFooter != undefined) {
            return props.PageFooter()
        } else {
            return <DefaultFooter />
        }
    }

    function PageJsBottom(): React.JSX.Element {
        // a következő sort kitörölni ha ez az elem nem felülbirálható az egyes oldalaknál.
        if (props.PageJsBottom != undefined) {
            return props.PageJsBottom()
        }
        return <></>
    }
    function CookieConsent(): React.JSX.Element {
        // a következő sort kitörölni ha ez az elem nem felülbirálható az egyes oldalaknál.
        if (props.CookieConsent != undefined) {
            return props.CookieConsent()
        }
        return <DefaultCookieConsent />
    }

    return (
        <div className={styles.page}>
            <Head>
                <title>Oldal cím</title>
                <meta name="description" content="Molitio Test App"></meta>
                <meta name="keywords" content="web, html, css, react, nextjs"></meta>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <PageJsTop />
            <header>
                <PageHeader />
            </header>
            <div id="whitepaper">
                <div id="sidebar1">
                    <SlideBarLeft />
                </div>
                <div id="content">
                    <PageContent />
                </div>
                <div id="sidebar2">
                    <SlideBarRight />
                </div>
            </div>
            <footer>
                <PageFooter />
            </footer>
            <CookieConsent />
            <PageJsBottom />
        </div>
    )
}
