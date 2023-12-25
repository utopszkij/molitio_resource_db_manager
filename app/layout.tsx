'use client';
import React from 'react';
import './globalStyles/globals.scss';
// import ReduxProvider from "../context/ReduxProvider";
import { Provider } from "react-redux";
import { appStore } from "../context/store";

const Layout: React.FC<React.PropsWithChildren> = ({children}) => {
//    const { children } = props;
    return (
        <html>
            <body>
                <Provider store={appStore}>{children}</Provider>
            </body>
        </html>
    );
};

export default Layout;
