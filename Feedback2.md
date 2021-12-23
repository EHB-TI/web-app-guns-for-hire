# Feedback: Security Testen

## Table of contents

- [Acceptance criteria](#acceptance-criteria)
  - [**Evaluatie Criteria ivm HTTPS**](#evaluatie-criteria-ivm-https)
  - [**Evaluatie Criteria ivm beveiliging tegen typische web vulnerabilities**](#evaluatie-criteria-ivm-beveiliging-tegen-typische-web-vulnerabilities)
  - [**Evaluatie Criteria ivm REST APIs**](#evaluatie-criteria-ivm-rest-apis)
  - [**Evaluatie Criteria ivm aanmelden**](#evaluatie-criteria-ivm-aanmelden)
  - [**Evaluatie Criteria ivm wachtwoorden**](#evaluatie-criteria-ivm-wachtwoorden)
  - [**Functionaliteiten**](#functionaliteiten)
  - [**GDPR**](#gdpr)
- [Andere bevindingen](#andere-bevindingen)
- [Gebruikte tools](#gebruikte-tools)
  - [**Applicaties**](#applicaties)
    - [OWASP ZAP](#owasp-zap)
    - [Snyk](#snyk)
  - [**Webtools**](#webtools)
    - [HSTSpreload](#hstspreload)
    - [SSLLabs](#ssllabs)
    - [Entrust CAA lookup tool](#entrust-caa-lookup-tool)
    - [Pentest-tools](#pentest-tools)
    - [2GDPR](#2gdpr)

> Dit verslag beschrijft onze bevindingen bij het testen van de
> beveiliging van de webapplicatie voorgebracht door Team Guns for Hire.
> Alle testen werden gericht op https://twitch-radio.xyz/ en hun github repository

## Acceptance criteria

### **Evaluatie Criteria ivm HTTPS**

| Criteria                                                                                                                      | Resultaat | Nota                                                       |
| ----------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------- |
| alle publiek bereikbare onderdelen van je web toepassing mogen enkel over HTTPS beschikbaar zijn;                             | ✔️        |                                                            |
| je domein of domeinen krijgen minstens een A score bij de [SSL Labs server test](https://www.ssllabs.com/ssltest/index.html); | ✔️        |                                                            |
| iedere respons bevat een Strict-Transport-Security header;                                                                    | ✔️        |                                                            |
| je domein of domeinen staan in de HSTS preload list of wachten op toevoeging;                                                 | ✔️        | twitch-radio.xyz wacht op toevoeging aan de preload lijst. |
| er zijn CAA DNS Resource Records voor je domein of domeinen;                                                                  | ❌        | Geen CAA record aanwezig                                   |

<br />

> ~~Om twitch-radio.xyz in aanmerking te laten komen voor preloaden, moeten onderstaanden errors opgelost worden:~~
>
> - ~~De header moet de “includeSubDomains” directie bevatten~~
> - ~~Domeinfout: Het www subdomein bestaat, maar we konden er geen verbinding mee maken via HTTPS~~
>
> UPDATE 13/12:
> twitch-radio.xyz is in afwachting van toevoeging aan de preload lijst.
> Het heeft echter nog steeds de volgende problemen, die we adviseren op te lossen:
>
> - De HTTP pagina op http://twitch-radio.xyz stuurt een HSTS header. Dit heeft geen effect over HTTP, en zou verwijderd moeten worden.

<br />

### **Evaluatie Criteria ivm beveiliging tegen typische web vulnerabilities**

| Criteria                                                                                                                                                                                                                                                                                      | Resultaat | Nota                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| geheimen zijn niet publiek beschikbaar;                                                                                                                                                                                                                                                       | ✔️        |                                                                                                                              |
| er wordt geen gebruik gemaakt van kwetsbare componenten - geen van de runtime dependencies hebben een High of Critical Severity CVSS score;                                                                                                                                                   | ❌        | Er zijn meerdere runtime dependencies met een Hoge CVSS score                                                                |
|                                                                                                                                                                                                                                                                                               |           |                                                                                                                              |
| indien je sessie cookies gebruikt tussen de browser en een server-side toepassing, zorg er dan voor dat                                                                                                                                                                                       | -         | -                                                                                                                            |
| - ze minstens SameSite: Lax zijn om het risico op CSRF te beperken;                                                                                                                                                                                                                           | NVT       | Er wordt geen gebruik gemaakt van cookies                                                                                    |
| - alle formulieren een CSRF token bevatten dat server-side gecontroleerd wordt;                                                                                                                                                                                                               | NVT       | Er wordt gebruik gemaakt van een acces token van een gebruiker dat in local storage wordt opgeslagen                         |
| - de sessie afloopt na verloop van tijd;                                                                                                                                                                                                                                                      | ❌        | De gebruiker ontvangt een acces token. De sessie verloopt niet.                                                              |
|                                                                                                                                                                                                                                                                                               |           |                                                                                                                              |
| indien je cookies gebruikt om het access token te transporteren tussen een SPA en de REST API (kan enkel indien OP, static web server en API dezelfde publieke suffix gebruiken), zorg er dan voor dat                                                                                        | -         | -                                                                                                                            |
| - ze SameSite: Strict zijn om CSRF te vermijden;                                                                                                                                                                                                                                              | NVT       | Er wordt geen gebruik gemaakt van cookies                                                                                    |
| - enkel over een geëncrypteeerd connectie kunnen worden verstuurd (Secure vlag);                                                                                                                                                                                                              | NVT       | Er wordt geen gebruik gemaakt van cookies                                                                                    |
|                                                                                                                                                                                                                                                                                               |           |                                                                                                                              |
| maak zo veel mogelijk gebruik van escaping en output encoding van een templating engine om XSS te vermijden;                                                                                                                                                                                  | ✔️        |                                                                                                                              |
| indien escaping van niet-vertrouwde data onmogelijk is, zorg dan voor sanitization om XSS te vermijden;                                                                                                                                                                                       | ✔️        |                                                                                                                              |
|                                                                                                                                                                                                                                                                                               |           |                                                                                                                              |
| definieer een strikte CSP voor je toepassing - een goede CSP draagt bij tot het bestrijden van XSS en andere injection aanvallen (HTML, CSS, ....), alsmede clickjacking;                                                                                                                     | ❌        | Er is geen CSP voorzien voor hun frontend pages, het is wel voorzien voor hun API requests                                   |
| - laat geen unsafe-inline toe. Inline scripts of styles worden best vermeden, maar indien toch nodig, dienen ze voorzien te worden van een [hash of nonce (Koppelingen naar een externe site.)](https://developers.google.com/web/fundamentals/security/csp/#if_you_absolutely_must_use_it_); | ❌        | unsafe-inline is niet geconfigureerd voor hun front-end pages, het is wel configureerd in hun API requests                   |
| - laat geen unsafe-eval toe;                                                                                                                                                                                                                                                                  | ❌        | Optie is niet geconfigureerd                                                                                                 |
|                                                                                                                                                                                                                                                                                               |           |                                                                                                                              |
| zet de X-Frame-Options header om clickjacking te vermijden of vermijd het met frame-ancestors in je CSP;                                                                                                                                                                                      | ❌        | De X-Frame-Options header is niet geplaatst in de header voor hun front-end pages, het is wel voorzien voor hun API requests |
| voor actieve resources van derden wordt SubResource Integrity (SRI) gebruikt;                                                                                                                                                                                                                 | ✔️        |                                                                                                                              |
| laad geen overbodige code, dit vergroot enkel de 'attack surface' van je toepassing;                                                                                                                                                                                                          | ✔️        |                                                                                                                              |
| X-Content-Type-Options: nosniff wordt gebruikt om MIME sniffing tegen te gaan.                                                                                                                                                                                                                | ❌        | X-Content-Type-Options: is niet voorzien voor hun front-end pages, het is wel voorzien voor hun API requests                 |

<br />

> We kunnen vaststellen dat de meest voorkomende problemen te maken hebben met hun security headers die niet correct geïmplementeerd zijn. Men spreekt hier over X-Frame-Options, X-Content-Type-Options, Content-Security-Policy, ... headers.
>
> We stellen ook voor dat jullie een tool net als Dependabot gebruiken. Dependabot helpt u uw dependencies up-to-date te houden. Elke dag controleert het uw dependency-bestanden op verouderde vereisten en opent individuele PR's voor alles wat het vindt. U bekijkt ze, voegt ze samen en gaat aan de slag met de nieuwste en veiligste releases.

<br />

### **Evaluatie Criteria ivm REST APIs**

| Criteria                                                                                                                                                                                                          | Resultaat | Nota |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- | --- |
| de API situeert zich minstens op niveau 2 van het Richardson Maturity Model                                                                                                                                       | -         | -    |
| - GET en OPTIONS safe en idempotent;                                                                                                                                                                              | ✔️        |      |
| - PUT en DELETE niet safe, maar wel idempotent;                                                                                                                                                                   | ✔️        |      |
| - POST en PATCH noch safe noch idempotent;                                                                                                                                                                        | ✔️        |      |
|                                                                                                                                                                                                                   |           |      |
| API URLs zijn als volgt gestructureerd:                                                                                                                                                                           | -         | -    |
| - voor een collectie: {API URL}/:collectie_id;                                                                                                                                                                    | ✔️        |      |
| - voor een element in een collectie: {API URL}/:collectie_id/:element_id;                                                                                                                                         | ✔️        |      |
|                                                                                                                                                                                                                   |           |      |
| het application/json media type wordt steeds ondersteund, zowel voor request als response bodies. De API mag ook andere media types aanvaarden, zoals bv. application/x-www-form-urlencoded, maar dat hoeft niet; | ✔️        |      |
| succesvolle requests worden beantwoord met status codes 200, 201 (in geval van een POST), of 204 (in geval er geen respons body is);                                                                              | ❌        |      |
| un-safe requests die niet succesvol zijn, hebben geen effect. Er wordt bijvoorbeeld geen element toegevoegd als een POST request resulteert in status code 400;                                                   | N.V.T     |      |
| indien vereiste request parameters ontbreken of request parameters geweigerd worden op basis van input validatie, dan wordt er een status code 400 of 406 terug gestuurd;                                         | ✔️        |      |     |
| een request die authenticatie vereist, maar geen access token bevat, geeft aanleiding tot status code 401;                                                                                                        | ✔️        |      |
| een request met een access token zonder de nodige permissies wordt beantwoord met status code 403;                                                                                                                | N.V.T     |      |
| GET, PUT, en OPTIONS requests op niet-bestaande resources resulteren in status code 404;                                                                                                                          | ❌        |      |
| methoden opgeroepen op resources die de methode niet ondersteunen geven aanleiding tot status code 405;                                                                                                           | ❌        |      |
| indien de Accept request header een niet ondersteund media type bevat, dan resulteert een request in status code 406;                                                                                             | N.V.T     |      |
| responses met een body bevatten zowel een correcte Content-Type header als X-Content-Type-Options: nosniff om MIME sniffing tegen te gaan;                                                                        | ✔️        |      |
| een collectie ondersteunt de methodes PUT, PATCH en DELETE niet. Ze worden dus beantwoord met status code 405;                                                                                                    | ❌        |      |
| POST wordt nooit ondersteund op een element                                                                                                                                                                       | ❌        |      |
|                                                                                                                                                                                                                   |           |      |

<br />

> Onze bevindingen
>
> - Succesvolle requests worden niet altijd met de juiste code beantwoord, **POST** request op *https://api.twitch-radio.xyz/twitch/findStreamer* gaf bijvoorbeeld een 200 terug > in plaats van 201. Er is geen sprake van requests zonder response body dus code 204 kan in geen gevallen teruggestuurd worden.
> - **GET** & **PUT** options op niet-bestaande resources geven effectief een 404 code terug maar, OPTIONS geeft een 204 No Content terug.
> - Code 404 wordt teruggestuurd wanneer een **niet-ondersteunde** methode gebruikt wordt MAAR, in de body wordt wel duidelijk vermeldt dat de methode niet gebruikt kan worden. > Voorbeeld, **POST** methode op *https://api.twitch-radio.xyz/twitch/findAllStreamers* geeft code 404 terug.
> - **PUT PATCH & DELETE** op een collectie geeft geen 405 maar 404.
> - API call naar https://api.twitch-radio.xyz/twitch/findStreamer is een **POST** en zou niet mogen aangezien 'findStreamer' geen collectie is maar een element.

<br />

### **Evaluatie Criteria ivm aanmelden**

| Criteria                                                                                                                                                                                                                                                                            | Resultaat | Nota |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| een gebruiker mag zich pas kunnen aanmelden als hij of zij controle over een email adres opgegeven tijdens registratie heeft aangetoond. Na het versturen van een registratieformulier krijgt de gebruiker melding dat instructies in de bevestigingsemail moeten worden opgevolgd. | N.V.T     |      |
| een gebruiker moet zich kunnen afmelden;                                                                                                                                                                                                                                            | ✔️        |      |
| de applicatie geeft ten alle tijde duidelijk aan of de gebruiker al dan niet aangemeld is;                                                                                                                                                                                          | ❌        |      |
| na aanmelden kan de gebruiker zijn of haar gegevens opvragen                                                                                                                                                                                                                        | ❌        |      |

<br />

> **Aanmelden was niet meer mogelijk sinds 07/12 tot en met 13/12 wegens niet werkende API**

> De logica bij het aanmelden wordt volledig door Spotify behandeld. Eigenlijk wordt er simpelweg eerst op spotify ingelogd, daarna wordt de email adres die gebruikt werd tijdens het inloggen vergeleken met diegene die in hun MongoDB staan. Als het email adres bestaat, dan zal de user met succes ingelogd zijn op de website.

<br />

### **Evaluatie Criteria ivm wachtwoorden**

| Criteria                                                                                                                                                                                                                                                                                                                                                                                                                      | Resultaat | Nota                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------- |
| bij registratie dient de gebruiker                                                                                                                                                                                                                                                                                                                                                                                            | -         | -                                                        |
| - te kunnen kopiëren uit een password manager en in een password veld van de registratiepagina plakken;                                                                                                                                                                                                                                                                                                                       | ✔️        |                                                          |
| - verplicht te worden een wachtwoord te kiezen van minstens 8 karakters;                                                                                                                                                                                                                                                                                                                                                      | ✔️        |                                                          |
| - een zeer lang wachtwoord te kunnen kiezen met lengte minstens 64 karakters;                                                                                                                                                                                                                                                                                                                                                 | ✔️        |                                                          |
| - elk 'printable' ASCII karakter te kunnen opnemen in het wachtwoord;                                                                                                                                                                                                                                                                                                                                                         | ✔️        |                                                          |
| - verplicht te worden een wachtwoord te kiezen dat niet vaak voorkomt. Per definitie komt een wachtwoord niet vaak voor als het minder dan 300 keer gevonden werd in een data breach volgens [Have I Been Pwned (Koppelingen naar een externe site.)](https://haveibeenpwned.com/) (HIBP). Tip: gebruik de [HIBP Pwned Passwords API (Koppelingen naar een externe site.)](https://haveibeenpwned.com/API/v3#PwnedPasswords); | N.V.T     |                                                          |
|                                                                                                                                                                                                                                                                                                                                                                                                                               |           |                                                          |
| bij aanmelden dient de gebruiker te kunnen kopiëren uit een password manager en in een password veld van de aanmeldingspagina plakken;                                                                                                                                                                                                                                                                                        | ✔️        |                                                          |
|                                                                                                                                                                                                                                                                                                                                                                                                                               |           |                                                          |
| de toepassing verdedigt zich tegen brute force en credential stuffing attacks. Aanvaardbare vormen van verdediging:                                                                                                                                                                                                                                                                                                           | -         | -                                                        |
| - bij herhaalde mislukte pogingen verhoogt het tijdsinterval tussen pogingen exponentieel;                                                                                                                                                                                                                                                                                                                                    | ❌        |                                                          |
| - MFA;                                                                                                                                                                                                                                                                                                                                                                                                                        | ❌        | Spotify ondersteunt geen MFA                             |
| - bij herhaalde mislukte pogingen wordt het account geblokkeerd. Het kan terug worden geactiveerd met een link verzonden per email;                                                                                                                                                                                                                                                                                           | ✔️        | Spotify blokeert jouw account bij _verdachte activiteit_ |
|                                                                                                                                                                                                                                                                                                                                                                                                                               |           |                                                          |
| wachtwoorden mogen nooit in plaintext worden opgeslagen. Enkel de output van een sterk wachtwoord-hash algoritme zoals Argon2 of bcrypt mag worden opgeslagen.                                                                                                                                                                                                                                                                | ✔️        |                                                          |

<br />

> ~~**De functionaliteiten IVM wachtwoorden kunnen momenteel niet getest worden aangezien we niet kunnen inloggen (TBC).**~~
>
> UPDATE 13/02:
> Authenticatie wordt volledig door Spotify behandeld. Aldus ook het beveiligen van passwoorden.

<br />

### **Functionaliteiten**

| Criteria                                                                                                                                                   | Resultaat | Nota |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| Als streamer en kijker ben ik verplicht te registreren om gebruik te kunnen maken van deze app                                                             | ❌        |      |
| Als streamer en kijker ben ik bij de registratie verplicht om mijn Spotify account te linken aan mijn profiel op deze app                                  | ❌        |      |
| Als streamer en kijker ben ik verplicht in te loggen na registratie                                                                                        | ❌        |      |
| Wanneer ik als kijker mijn twitch link aan mijn profiel op deze app, wordt ik een streamer                                                                 | ❌        |      |
| Als streamer en kijker heb ik de mogelijkheid om streamers op te zoeken aan de hand van zijn/haar username van Twitch                                      | ❌        |      |
| Als streamer en kijker heb ik de mogelijkheid om het profiel van de gevonden streamer te bekijken                                                          | ❌        |      |
| Als streamer en kijker heb ik de mogelijkheid om op het profiel van de gevonden streamer het lied waarnaar deze streamer aan het luisteren is af te spelen | ❌        |      |

<br />

> ~~**Omdat jullie website enkele belangrijke functionaliteiten miste, zoals inloggen, is het moeilijk om de veiligheid van de website tot het uiterste te testen. De API blijkt de hoofdreden te zijn, deze werkt niet en aldus kunnen we niet inloggen.**~~
>
> UPDATE 13/02:
> Alle functionaliteiten die in jullie Acceptance Criteria zijn beschreven werken niet. Op dit moment is het alleen mogelijk om in te loggen met de twee gebruikers die door het Guns For Hire team zijn opgegeven:
>
> - softsec.streamer@hotmail.com
> - softsec.watcher@hotmail.com
>
> Het is niet mogelijk om te registreren met een nieuw account. Alle functionaliteiten omtrent registratie zijn aldus niet te testen.

> Wanneer we inloggen op uw website komen we op deze URL: https://twitch-radio.xyz/profile. Deze pagina toont ons het profiel van de ingelogde gebruiker. Als we teruggaan naar de basis URL (https://twitch-radio.xyz/) dan komen we terecht op de login pagina. Dit zou niet mogen gebeuren aangezien je je net hebt ingelogd.

> Een streamer opzoeken is niet mogelijk. Maar we hebben ontdekt dat als je de lokale cache opslag van je browser leegt en dan opnieuw inlogt, je de streamer (softsec.streamer) kunt vinden. Maar het werkt maar één keer, als je refresht krijg je een foutmelding.

<br />

### **GDPR**

| Criteria                                                                  | Resultaat | Nota                          |
| ------------------------------------------------------------------------- | --------- | ----------------------------- |
| De applicatie zal conform zijn met de GDPR regels & de ePrivacy richtlijn | ✔️        | Getest met https://2gdpr.com/ |

## Andere bevindingen

> Als je na het inloggen terug op de hoofdpagina terecht komt is de knop om in te loggen nog steeds zichtbaar. Dit kan voor verwarring zorgen.

> :arrow_right: Zorg ervoor dat de gebruiker automatisch terug naar zijn profielpagina wordt gebracht.

> In de local storage van de browser zien we dat de access_token die gebruikt wordt om in te loggen op spotify zichtbaar is voor de ingelogde gebruiker.
> Door deze acces_token te hergebruiken kunnen we bijvoorbeeld gevoelige data over de ingelogde user opvragen zoals zijn volledige naam of email adres. Verder kunnen we ook de refresh_token van spotify daarvan uithalen. Deze kan ook gebruikt worden om constant nieuwe acces_tokens op te vragen.

> :arrow_right: Zorg ervoor dat de access_token niet zichtbaar is voor de gebruiker.

> In de code van element met PATH: auth/token/verify binnen de API, merken we dat er een response code van 200 wordt teruggestuurd in de Catch gedeelte. Als de compiler binnen de scope van de Catch methode geraakt, dan dient deze ook de juiste response code terug te sturen.

> :arrow_right: Response code moet gewijzigd worden.

> Er zijn nog steeds foutmeldingen die in de browser dev console verschijnen, namelijk : _Warning: Each child in a list should have a unique "key" prop_ & _WebSocket connection to 'wss://twitch-radio.xyz/sockjs-node' failed:_.

> :arrow_right: Voor de eerste foutmelding moet er naar de render methode van 'ProfileTemplate' gekeken worden.

> :arrow_right: Voor de tweede foutmelding blijkt het probleem zich in webpackHotDevClient.js:60 te vinden.

## Gebruikte tools

### **Applicaties**

#### OWASP ZAP

**![](https://lh5.googleusercontent.com/yb-1J3AUP_q994vnwIwtuX9PrwrcqKm8SEizsX6VUQBiTvxHR2KT7fXGKOvoYMivm7O-Ug_tfpTMwTd5NfFRIfQXXdLxv5rSUzj3J6eDrezPuFOGmtZuJ8RtH4yNTDiVVBLyY0HB)**
**![](https://lh6.googleusercontent.com/JJ4MWSV-Hhs1ZNeNV5jZotPbWPOJ48yR8Mb9THcOOQBGFWMY7OTUysTSUmNQXTXDSBqcNTMJ33lqT2D42jc9biJBkkZEwU8ka6lEHTRnq626Yfpq2fh3DjsoxM1VxTK3xGwd4Dti)**
**![](https://lh6.googleusercontent.com/vbwSjJdE7JBnBhbLwiaFm4HWjcPhcKm3a_V8VH3kTFg0eKrSU3vQjP0Izijg2jtycmLDN15IZtujeIyuCYSxurLYPXJIYG8C6jhQjr5lYcTgw_RC-aOVWjUgXD4No0D423rHkshx)**
**![](https://lh3.googleusercontent.com/KFk3uXNcjV8Z8pzL3WdDCfwqUceL9Etobr3TTqN3Q7z22AV0Thfs2ikgFQEl4Z8IHYRYlcio_ZDg9Tjkkco05KMXsYhYb4LjhfwRTIeavnNu7FxZyFazThQOWcxEeeOy-Cvwh3mu)**
**![](https://lh5.googleusercontent.com/_NCricTe7L7-cz8JUScOrnzbr-fzwIeOri4tAL5O8OSi0c8mjBvNVKAtFCUh6UjanLBOB8t2ULmSU4ahg5aFgcLUCelnzAn_WYqBqQSefQRr_QHX-zviGdCkIvuWniFufDwpRcqZ)**

#### Snyk

**![](https://lh6.googleusercontent.com/e07Qoyv1NJUNzOtVKG1bLvfVLwDBPWdOdXq69Zvevc-fBHbRbcQmVXGo52KvEtUZ8arBLLdK7gwiNzjktvLBYlyMZZ_75bZ_SZ-fJZafwDJHgWgAPUTXVSrmXhxsuYBciRcgmTjy)**

### **Webtools**

#### HSTSpreload

**![](https://lh4.googleusercontent.com/zSqmoH5QxcLrYyKZqNmxqDZAlH90t-Wp6sk4AWpxT4dZdTstJGJoa3TdwK-UGBvtLsaUN6LWl3RN2N_utFHQHe0QC1FAZvKJUiy5GF56_XrCizgOdS-sHYwpcCnEaD2tRwGc7l_R)**

#### SSLLabs

**![](https://lh6.googleusercontent.com/0TQIKzzgJFXLaqC4WaBo0UFreKwf56V_4eSYOhrLfcVcRgzkC0UhnINdGSaIS-yEGCk8pkYFwXB60cX74l8Aoi1IV2H3m_VBVQrf7NFk4t4uJyGoDCScU8dgLib4Fb9MrIFcZA1i)**

**![](https://lh6.googleusercontent.com/q_QvL6jn9Xa2eiGLIYe3ZdpHbK_BpDblmaI4TnhgAIcWcX69F-RbFnTO8y4AbENbnpw6i5l2dfex6P29q_NkqJBfqxLcDEoznEuOp6wVIWPqvHO8hphOZzi3hx2h0iiocpWD4Vvu)**

#### Entrust CAA lookup tool

**![](https://lh6.googleusercontent.com/sdcRWZaLGwtYklaFh_lOmAFcsozcyIQlQTn8-msjxvGkgqyAU3_UVTh8n4LWI0-bCEQJ5QIuvm5Z084fcQ5VVOy1aAMcCLn9UIbMH5-qIpLpo2xjvhKc8jcbcE-4NZcAiGqXD6LC)**

#### Pentest-tools

**![](https://lh4.googleusercontent.com/drGBZLPqL_KenWbKV9Dg2ou8aFIpcf2oa7GK5qJjr_U24Gp8bIf124iGmbpEL4gd-AK5ijXCLBUtIwlQEoR8cCTpZQhZCoJwLUNRBsR2GPY0sbiXYj7my8jIODRlh92ULQzmKXFJ)**

**![](https://lh6.googleusercontent.com/AqeX6Kcmjyb5fP5QR99qLvgys0KpZHEPWE8JvMq5EIHYq9UtoOGNTHsoLQSIbkZHbfpPSmZoELS1v9kAPCgNxJYLIwM15PVlPiXsdcCxag2ZVMtURL99NuWNSW-K5b_kuPZW8CBT)**

**![](https://lh4.googleusercontent.com/XQBZ4PxbNsjsZfb2aH8ZWoPwIGDE_NqjopxXcW7J82sDQhoSBAXciX1bAoCsIO9PqJs2s3vx3rnKdfvoAkCzaz6TK6FbY6PfOsjW3fasJWED4VAPmgNL3lE8LDye7NwS1TjtqEE6)**

**![](https://lh3.googleusercontent.com/M_HmhCiL_6KxdgJrgkBeYHmfFyTCT3khypN9yr81AnoB-lC-O6fqxJKUe982ylbXeVfsKV3CFFWd1UpInadhK62eMTqzdRMpSmwx5vKLUhm0Kp54UBEtfGQXuGnxSpg7zMXUiqnY)**

**![](https://lh4.googleusercontent.com/48UUNeUEYTWvAEeq1ScpJSWdzOVoFOLJI9eQEjreqA6mKXirByPVxyUE0wuQ0cOmeCe1TdMxy-uqU--Fsza4AYcwsyw4IFvDC4Eg1we3HM607vrW5MJNXmPndoLnaOO7CAahvnfj)**

**![](https://lh4.googleusercontent.com/F-MGC3EZJcRmZBohn_1kWLRzXZugyCfx2nPoCg_DW9ZSGpAbQuHfhm0qfgVAwXWMn6_05RYJe9ivxUr1r7ZYK4udh0rn4LqINgvFv1GjUIsC507DEMe5kBU5YFMa_7WpefmJqrEI)**

**![](https://lh6.googleusercontent.com/P1VK4s_P-lm-JW_QjboyCSYnu1XLRdY0aPkyh8rE8st8-1m_cTeQppyD0kc5epy3EGRMD1kkuHZsTi8BXSL4krL7R7L2aDwvXmseGQ5vtg_5jl9_aXj7Tmye02bUTVM4HcZ6Wgel)**

> Er is geen bijzonder veiligheidsrisico verbonden aan het hebben van een robots.txt bestand. Dit bestand wordt echter vaak misbruikt door websitebeheerders om te proberen sommige webpagina's te verbergen voor de gebruikers. Dit moet niet worden beschouwd als een veiligheidsmaatregel omdat deze URL's gemakkelijk rechtstreeks uit het robots.txt bestand kunnen worden gelezen.

#### 2GDPR

**![](https://lh3.googleusercontent.com/RFHrshoCr3If8AfZ_rRf8-MBOT1yo07GLOaQz3On6gs_uwz3yIE5Z0PRec5vhInNHHjwaxRHeqtaSaZdZ0tYzUQVke0aHt7CP7bz5d1cytBWraAbgwGsmich4CBv6keOh1D-pZ1h)**
