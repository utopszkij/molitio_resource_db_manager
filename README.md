# Molitio Resource database admin manager application

## features

- resource_community browser, add, edit, delete, show
- resource_collection browser, add, edit, delete, show
- resource browser, add, edit, delete, show
- resource_label_type browser, add, edit, delete, show
- resuorce_community  /  labels browser, add, edit, delete, show
- resuorce_collection  /  labels browser, add, edit, delete, show
- resuorce  /  labels browser, add, edit, delete, show
- human multilanguage support (defined only hungarian)
 
Videó ismertető:
 
https://drive.google.com/file/d/1s2WsLSV6PTOylfnf8InV9NK9gTwJtiJs/view?usp=drive_link

## Properties

- app root 
- jest unittes
- React FC
- Redux 
- Hasura database interface, JWT authorization

Author: Fogler Tibor (Utopszkij)  tibor.fogler@gmail.com

2023.12.06


## ATTENTION ##

The login/registration authorization system has not yet been established.

Temporarily uses the "testUser" defined in the code of the formManager (this would all be logged in)

### status

in develop

### version

v1.0.0   only for  test and develop!

### Directory structure
```
app
    page.tsx               the default start page of the web site
    layout.tsx             root layout
    globalstyles/
        globals.scss       Global Style
    api
        apiName1
            route.tsx
        apiName2
            route.tsx
        
    pagename1/
        pagename1.tsx      Link to the component into component directory 
    pagename2/
        pagename2.tsx      
         
    [id]/parpagename1/
        parmagename1.tsx
    [id]/parpagename2/
        parmagename2.tsx
    
    
components
    SiteLayout/             web site layout
    Translator/             multi language system
    DatabaseInterface/      database interface
    FormManager/            fomr manager support functions  
    CookieConsent/          cookie consent modul
    PageName1/              PageName1 React komponens
        index.ts
        PageName.tsx
        PageName.module.scss
    PageName2/              PaheName2  React komponens
        index.ts
        PageName.tsx
        PageName.module.scss
    
public
    dictionaries/           dictionaries (json files)
    img/                    images, videos
    js/                     javascript files into client
    vendor/                 other files into client
styles    
    common-module.scss      globál modul scss
    variables.scss          scss vasriables
__tests__/                  unit test files
node_modules/               node modulok
    
```
    
## install

- yarn add @reduxjs/toolkit
- yarn add react-redux
- yarn add cookies-next
- yarn add jsonwebtoken
- yarn install

Create tables, relationshippes in hasura, use metadata from documentation folder!

On the hasura graphQ interface, "testuser" must be added to the user_public table, and
update testUser.id in formManager.tsx.

See also the comment of the DatabaseInterface object!


## run local developer version

yarn dev

## run unittests

yarn test


# Required

- node v18.17.1
- npm v9.6.7
- yarn v.22.19
- jest v29.7.0
- npx v10.1.0
- nextjs sass opció
- hasura

# hasura auth config  (for later development)

```
Configure Hasura JWT mode

You can enable JWT mode by using the --jwt-secret flag or **HASURA_GRAPHQL_JWT_SECRET** environment variable; the value of which is a JSON object. More info on running Hasura Engine with the flag or environment variable is here.

Example JWT JSON configuration object:

{
  "type": "<optional-type-of-key>",   // HS256 | RS256
  "key": "<optional-key-as-string>",  // 32 char random key | 2048 bit rsa pubkey
  "claims_format": "json"
}

Hasura JWT
Example Decoded Payload

{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "iat": 1516239022,
  "https://hasura.io/jwt/claims": {
    "x-hasura-default-role": "user",
    "x-hasura-allowed-roles": ["user", "admin"],
    "x-hasura-user-id": "123",
    "x-hasura-org-id": "456",
    "x-hasura-custom": "custom-value"
  }
}

Hasura JWT format

The x-hasura-role value can be sent as a plain header in the request to indicate the role which should be used.

When your auth server generates the JWT, the custom claims in the JWT must contain the following in a custom https://hasura.io/jwt/claims namespace:

    A x-hasura-allowed-roles field. A list of allowed roles for the user i.e. acceptable values of the optional x-hasura-role header. See more
    A x-hasura-default-role field. The role that will be used when the optional x-hasura-role header is not passed. See more
    Add any other optional x-hasura-* claim fields (required as per your defined permissions) to the custom namespace. See more

The JWT should be sent to Hasura Engine in an: Authorization: Bearer <JWT> header. Eg:

POST /v1/graphql HTTP/1.1
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWI...
X-Hasura-Role: editor

async funtion fetch(url,
                   { 
                     Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWI...
                     X-Hasura-Role: editor
                     method: "POST",
                     body: JSON.stringify({
                            query: operationsDoc,
                            variables: variables,
                            operationName: operationName
                          })
                    })

...

create JWT example
 

token = {id, name, email}
sectet = configured JWT key | rsq privkey
encode: async ({ secret, token, maxAge }) => {
      const jwtClaims = {
        "sub": token.id.toString() ,
        "name": token.name ,
        "email": token.email,
        "iat": Date.now() / 1000,
        "exp": Math.floor(Date.now() / 1000) + (24*60*60),
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": token.id,
        }
      };
      const encodedToken = jwt.sign(jwtClaims, secret, { algorithm: 'HS256'| 'RS256'});
      return encodedToken;
},


```

## Human multilanguage system 

Dictionaries  JSON files in  public/dictionaries folder:
- hu.json       global magyar
- en.json       global english
- de.json       global german
- PageName1.modul.hu.json  for PageName1 magyar   
- PageName1.modul.en.json  for PageName1 english   
- PageName1.modul.de.json  for PageName1 german
   

A dictionary file:
```
{
    "token1":"lefordított szöveg",
    "token2":"lefordított szöveg",
    
}
```

It is to be imported into the components of the individual productscomponents of each olak

```
import {useAppSelector, useAppDispatch} from "../../app/redux/ClientHooks"
import {selectTranslatorData, setModulName} from "../../app/redux/ClientSlice"
import {TranslatorDisplay, TranslatorTrans, Flags} from '../Translator/Translator';
```

To the code of the component
```
	const translatorData = useAppSelector(selectTranslatorData);
    const dispatch = useAppDispath()
    dispatch(setModulName('modulName'|''))
	const t = (token:string):string => { return TranslatorTrans(translatorData, token); }
```
in the HTML of component:
```
{ t('token') }    
```

### Translate with params

example

English dictionary:  
- "owner_children":"$1 in $2",
- "home:":"home",
- "kitcen":"kitcen",

Hungarien dictionary:: 
- "owner_children":"$2 -ban/ben a(z) $1"   
- "kitchen":"konyha",
- "home":"lakás"

t('owner_children',t('kitchen'), t('home'))    translate::

english: "kitchen in home"

hungarien: "lakás - ban/ben a(z) konyha"


