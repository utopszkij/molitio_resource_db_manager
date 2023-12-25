import { render, screen } from '@testing-library/react';
import { Provider } from "react-redux";
import { appStore } from "../context/store";
import Team from '../components/TeamPage/TeamPage';

/*
install:

lásd:
https://github.com/vercel/next.js/tree/canary/examples/with-jest


*/

    test('team page test', () => {
        const { container } = render(<Provider store={appStore}><Team /></Provider>);
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
        // #team exists?
        expect(container.querySelectorAll('#team').length).toBe(1);        

    });

    