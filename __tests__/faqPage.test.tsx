import { render, screen } from '@testing-library/react';
import { Provider } from "react-redux";
import { appStore } from "../context/store";
import Faq from '../components/FaqPage/FaqPage';

/*
install:

lásd:
https://github.com/vercel/next.js/tree/canary/examples/with-jest


*/

    test('faq page test', () => {
        const { container } = render(<Provider store={appStore}><Faq /></Provider>);
        // container.querySelectorAll, .querySelector, .innerHTML, .className ... hasznlható;
        // lásd: https://www.w3schools.com/jsref/dom_obj_all.asp

        //expect: toBy(value), toByDefined(), toBeFalsy(), toBeGreaterThan(number | bigint), 
        // .toBeGreaterThanOrEqual(number | bigint),
        //.toBeLessThan(number | bigint), .toBeLessThanOrEqual(number | bigint), .toBeInstanceOf(Class), .toBeNull()
        // .toBeTruthy(), .toBeUndefined(),.toBeNaN(), .toEqual(value), .toMatch(regexp | string),....
        // https://jestjs.io/docs/expect

        // <header> exists?
        const headers = container.querySelectorAll('header');
        expect(headers.length).toBe(1);
        // <footer> exists?
        const footers = container.querySelectorAll('footer');
        expect(footers.length).toBe(1);
        // #faq exists?
        expect(container.querySelectorAll('#faq').length).toBe(1);        

    });

    