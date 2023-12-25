/**
 * Cookie consent data types
 */

export type CookieConsentData = {
    checked: boolean,
    workEnabled: boolean,
    statisticEnabled: boolean,
    marketEnabled: boolean,
    customizeEnabled: boolean 
}

export type CookieConsentStoreState = {
    cookieConsent: CookieConsentData
}