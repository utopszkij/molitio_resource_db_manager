import '@testing-library/jest-dom';

var fetchResults = [];
var jsonPromise = {
    json: () => {
        return {
            then: (callBackFun) => {
                let res = {};
                if (fetchResults.length == 0) {
                    res = {errors:[{message:'fetch mock error'}]};
                } else {
                    res = fetchResults.splice(0,1)[0];
                }
                callBackFun( res );
                return { catch: (errorFun) => { errorFun({msg:'jsonParseError'}) }};
            }
        }
    }
}
window.fetch = (url,par) => {
    return {
        then: (callBackFun) => {
            callBackFun(jsonPromise);
            return { catch: (errorFun) => { errorFun({msg:'fetchError'}) }};
        }
    }
}
export function setFetchResults(p) {
    fetchResults = p;
}
window.scrollTo = (x,y) => {};

