import { render, screen } from '@testing-library/react';
import { Provider } from "react-redux";
import { appStore } from "../context/store";
import Home from '../components/HomePage/HomePage';

/*
install:

lásd:
https://github.com/vercel/next.js/tree/canary/examples/with-jest


*/

    //+ mock json fetch
        var jsonPromise = {
            json: () => {
                return {
                    then: (callBackFun: Function) => {
                        callBackFun( {yes:"Igen", no:"Nem"});
                        return { catch: (errorFun:Function) => { errorFun({msg:'jsonParseError'}) }};
                    }
                }
            }
        }
        window.fetch = (url:string) => {
            return {
                then: (callBackFun: Function) => {
                    callBackFun(jsonPromise);
                    return { catch: (errorFun:Function) => { errorFun({msg:'fetchError'}) }};
                }
            }
        }
    //-mock

    test('home page test', () => {


        const { container } = render(<Provider store={appStore}><Home /></Provider>);
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

    });

    /*
    test('placeholder', () => {
        expect(true);
    });

    test('home page tartalmazza a megadott szöveget', async () => {
            render(<Home />);
        const homePageTitle = await screen.getByText('MOLITIO a npx jestdigitális és humanitárius világ összekötése');
            expect(homePageTitle).toBeInTheDocument();
    });


        test('cover pages should load and displays title if one is provided', async () => {
            const testText = 'test text';

            render(<CoverPage headerText={testText} />); 
            render(<CoverPage />);
            const coverPageTitle = await screen.findByText(testText);
            expect(coverPageTitle).toBeInTheDocument();
        });

        test('cover page should have one title', async () => {
            const { container } = render(<CoverPage />);
            const h1Elements = container.querySelectorAll('h1');
            expect(h1Elements.length).toBe(1);
        });

        test('cover page should have a background image', async () => {
            render(<CoverPage />);
            const coverPageBackgroundImage = await screen.findByTestId('cover_page_default_background_image');
            expect(coverPageBackgroundImage).toBeInTheDocument();
        });

        test('cover page background image should have a default alt text', async () => {
            render(<CoverPage />);
            const coverPageBackgroundImage = await screen.findByAltText('default_background_image');
            expect(coverPageBackgroundImage).toBeInTheDocument();
        });

        test('cover page should display custom item when provided as a child to CoverPage', async () => {
            const testId = 'test_div';
            const testDiv = <div data-testid={testId}>test div</div>;

            render(<CoverPage>{testDiv}</CoverPage>);
            const coverPageTestDiv = await screen.findByTestId(testId);
            expect(coverPageTestDiv).toBeInTheDocument();
        });
        */
