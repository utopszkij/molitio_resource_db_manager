/**
 * süti engedélyezés, beállítás kliens oldali javascript
 */
$(document).ready(function () {
    // oldal böngészőben történő renderelése után futó kód

    // a"policy" oldalt meg lehet nézni süti emgedélyezés nélkül is.
    if (document.URL.indexOf('policy') <= 0) {
        // a süti engedélyező/kezeő objektum létrehozása
        // (vendor/cookie-consent-content).
        // Ez automatikusan kéri a süti engedélyezést amikor
        // egy user először látogat erre az oldalra.
        cookieSettings = new BootstrapCookieConsentSettings({
            contentURL: '/vendor/cookie-consent/cookie-consent-content',
            privacyPolicyUrl: '/policy',
            legalNoticeUrl: '/terms',
            postSelectionCallback: function () {
                // location.reload() reload after selection
            },
        });
    }

    // süti beállítások gomb klikk kezelő rutin
    $('#cookieBtn').click(() => {
        if (cookieSettings != undefined) {
            cookieSettings.showDialog();
        }
    });
});
