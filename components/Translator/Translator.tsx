import Styles from './Translator.module.scss';
import { DictionaryType, TranslatorDataType } from '../../context/types';
import { setDictionary, setLng, useAppDispatch } from '../../context/store';
import { Cookies } from '../CookieConsent/Cookies';

type TranslatorType = {
    translatorData: TranslatorDataType,
    loadDictionaries: Function,
    getByName: Function,
    t: Function
}

const loadModulDictionary = (modulName:string, lng: string, dispatch:Function) => {
    if (modulName != '') {
        let fileName = modulName + '.modul.' + lng +'.json';
        let promise = fetch('/dictionaries/'+fileName);
        promise.then((response: Response) => {
            const json = response.json();
            json.then ((response2) => {
                dispatch(setDictionary({
                            name: modulName+'.'+lng,
                            position:0,
                            items: response2,
                            loaded: true
                        }));
            }).catch( (error) => { console.log('error in json parse '+modulName+' '+lng);
                                   console.log(error);
            })
        }).catch( (error) => { console.log('error dictionary fetch '+modulName+' '+lng);
                               console.log(error); 
        })
    } else {
        dispatch(setDictionary({
            name: '',
            position:0,
            items: {},
            loaded: true
        }));
    }
}

const loadGlobalDictionary = (lng: string, dispatch:Function) => {
    let fileName = lng +'.json';
    let promise = fetch('/dictionaries/'+fileName);
    promise.then((response: Response) => {
        const json = response.json();
        json.then ((response2) => {
            dispatch(setDictionary({
                        name: 'global.'+lng,
                        position:1,
                        items: response2,
                        loaded: true
            }));
            dictionaryStatus = 'loaded';
        }).catch( (error) => { console.log('error in json parse global '+lng);
                               console.log(error);
        })
    }).catch( (error) => { console.log('error dictionary fetch global '+lng);
                           console.log(error); 
    })
}

// ======================== Hasura test =====================================
async function fetchGraphQL(
    operationsDoc: string,
    operationName: string,
    variables: Record<string, any>
  ) {
    return fetch('http://localhost:8080/v1/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query: operationsDoc,
        variables,
        operationName,
      }),
    }).then(result => result.json());
  }

  /*
  const operations = `
    query MyQuery($dicName: String = "dictionary_global_hu") {
      resource_schema_resource_label(where: {resource: {name: {_eq: $dicName}}, _and: {resource_label_type: {type_name: {_eq: "dictionary_item"}}}}) {
        value
        id
      }
    }
  `;
  */

  function fetchMyQuery(queryName: string,
                        operations: `
                        query MyQuery($dicName: String = "dictionary_global_hu") {
                            resource_schema_resource_label(where: {resource: {name: {_eq: $dicName}}, _and: {resource_label_type: {type_name: {_eq: "dictionary_item"}}}}) {
                              value
                              id
                            }
                          }
                        `,
                        params: Record<string, string>) {
    return fetchGraphQL(operations,queryName, params);
  }

    /*  
        Tapasztalatok:  
        - a hasurában definiált relationships -ben össtekapcsolt táblák szerepelhetnek
          a select és where részben (talán a foreign key definició ezt létre is hozza)
        - a 'MyQuery'  csak korábban a hasurában definiált lehet
        - viszont az "operations" stringben lehet változás a select oszlopokban
          és a where reláció kodokban és operátorokban is
          reláció kodok: _eq, _gt, _gte, _lt, _lte, _neq, _ilke, _nlike, _regex, _nlegex, _regex, _in
          oprátorok: _and, _or, _not
    */ 

   async function dbQuery(queryName: string, 
                    variables: Record<string, string>,
                    dispatch: Function) {
        const queries = {
            MyQuery: { operations: `
                        query MyQuery($dicName: String = "dictionary_global_hu") {
                            resource_schema_resource_label(
                                where: {resource: {name: {_eq: $dicName}}, _and: 
                                       {resource_label_type: {type_name: {_eq: "dictionary_item"}}}}
                            ){
                              value
                              id
                            }
                        }
                        `,
                      resultProcessor: (result:object, error?: any) => {
                         console.log('dbQuery resutlProcessor');
                         if (error == undefined) {
                            console.log(result);
                            dispatch(setDictionary({
                                name: 'global.hu',
                                position:1,
                                items: {},
                                loaded: true
                            })); 
                            console.log('dispatch után');
                        } else {
                            console.log(error);
                        }
                       }
            }
        }                        
        type ObjectKey = keyof typeof queries;
        const key = queryName as ObjectKey;
        const query = queries[key];
        return fetchGraphQL(query.operations,queryName, variables)
               .then(query.resultProcessor)
               .catch(error => { 
                   console.log(queryName+' error');
                   console.log(error); 
                   console.log('variables:');
                   console.log(variables);
                })
    }
// ======================== Hasura test =====================================


/**
* Global variable; this marked then dictionary loading status.
* ''|'loading'|'loaded'
*/
var dictionaryStatus = '';
/**
 * human language translator object
 */
export const Translator:TranslatorType = {
    translatorData: {lng:'', dictionaries:[]}, // must set it in React component body!

    /**
     * Load modul and global dictionaries for actual lng.
     * (lng read from cookie)
     * WARNING!  
     * - you can only call once per page
     * - may only be called in the form 'onload' event handler.
     * @param modulName // modulName (example: 'homePage') or ''
     * @param dispatch  // Redux update handler
     */
    loadDictionaries: (modulName: string, dispatch: Function) => {
        // ron only once!
        if (dictionaryStatus == 'loading') {
            return
        }
        // set marker to loading
        dictionaryStatus = 'loading';

        // get lng from cookie
        let lng = String(Cookies.getCookie('customize_lng'));
        if ((lng == '') || (lng == 'undefined')) {
            lng = 'hu';
        }   

        if ((Translator.translatorData.dictionaries[0].loaded == false) ||
            (Translator.translatorData.lng != lng) ||
            (Translator.translatorData.dictionaries[0].name != modulName+'.'+lng)) { 
            loadModulDictionary(modulName, lng, dispatch);
        }    
        if ((Translator.translatorData.dictionaries[1].loaded == false) ||
            (Translator.translatorData.lng != lng) ||
            (Translator.translatorData.dictionaries[1].name != 'global.'+lng)) { 
            loadGlobalDictionary(lng, dispatch);
        }    
        // ======================== Hasura test =====================================

        // console.log('dbQuery jön');
        // dbQuery('MyQuery',{dicName:'dictionary_global_hu'}, dispatch); 
        // console.log('dbQuery után');

        /*
        console.log('fetchMyQuery jön');
        fetchMyQuery('MyQuery',operations, {dicName: 'dictionary_global_hu'})
            .then(({ data, errors }) => {
                if (errors) {
                    console.log('fetchMyQuery error 1');
                    console.error(errors);
                }
                console.log('fetchMyQuery result');
                console.log(data);
                console.log('dispatch jön');
                dispatch(setDictionary({
                    name: 'global.'+lng,
                    position:1,
                    items: data,
                    loaded: true
                }));
                console.log('dispatch után');
                }
            )
            .catch(error => {
              console.log('fetchMyQuery error 2');
              console.error(error);
            });
            console.log('fetchMyQuery után');
        */    
        // ======================== Hasura test =====================================
        
    },
    
    /**
     * auxiliary function reading element from object based on name
     * if it is not in then returns the name
     * @param obj
     * @param name
     * @returns string
     */
    getByName: (obj: any, name: string): string => {
        type ObjectKey = keyof typeof obj;
        const key = name as ObjectKey;
        if (obj[key] != undefined) {
            return obj[key];
        } else {
            return name;
        }
    },

    /**
     * with the help of translate by dictionaries.
     * - if the token is defined in both the module dictionary and the global dictionary, 
     *   the token in the module is used
     * - if none, then returns the token
     * @param token
     * @param param1  if $1 is included in the token translation string, replace it with param1
     * @param param2  if $2 is included in the token translation string, replace it with param2
     * @param param3  if $3 is included in the token translation string, replace it with param3
     */
    t: (token: string, param1?: string, param2?: string, param3?: string): string => {
        let key:number = 0;
        let result = '';
        let loaded = false;
        let dic:DictionaryType;
        if (Translator.translatorData.dictionaries.length > 0) {
            // all dictionaries loaded?
            loaded = true;
            for (key = 0; key < Translator.translatorData.dictionaries.length; key++) {
                dic = Translator.translatorData.dictionaries[key];
                if (!dic.loaded) {
                    loaded = false;
                }
            }
            if (loaded) {
                result = token;
                key = 0;
                while ((result == token) && (key < Translator.translatorData.dictionaries.length)) {
                    dic = Translator.translatorData.dictionaries[key];
                    result = Translator.getByName(dic.items, token);
                    key++;
                }
            }
            result = result.replace('$1',String(param1));
            result = result.replace('$2',String(param2));
            result = result.replace('$3',String(param3));
        }
        return result;
    },
};

/**
 *
 * Flags React component. show tree flags and define click event handler
 */
export const Flags = (): React.JSX.Element => {
    const dispatch = useAppDispatch();

    function setLanguage(langKey: string) {
        dispatch(setLng(langKey));
        document.getElementById('whitepaper')?.setAttribute('dicLoaded','notloaded');   
        Translator.loadDictionaries('homePage', dispatch)
    }

    return (
        <div id="flags" className={Styles.flags}>
            <var className={Styles.flags_hu} onClick={() => setLanguage('hu')} title="magyar"></var>
            <var className={Styles.flags_en} onClick={() => setLanguage('en')} title="english"></var>
            <var className={Styles.flags_de} onClick={() => setLanguage('de')} title="deutsche"></var>
        </div>
    );
};

// sort caller for Translator.t
export default function t(token: string, p1?: string, p2?: string, p3?: string): string {
    return Translator.t(token, p1, p2, p3);
}
