import { render, screen } from '@testing-library/react';
import { Provider } from "react-redux";
import { appStore } from "../context/store";
import Terms from '../components/TermsPage/TermsPage';

/*
install:

lásd:
https://github.com/vercel/next.js/tree/canary/examples/with-jest


*/

    test('terms page test', () => {
        const { container } = render(<Provider store={appStore}><Terms /></Provider>);
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
        // #terms exists?
        expect(container.querySelectorAll('#terms').length).toBe(1);        

    });

    