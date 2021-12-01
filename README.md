# Goal

Twitch streamers spelen graag muziek af als achtergrond muziek of om stille momenten te vullen. Het probleem is dat als ze muziek afspelen dat ze kans maken om een DMCA claim te krijgen. Dit kan er voor zorgen dat jouw account wordt verwijderd.

Om dit te vermijden willen wij een website maken dat de muziek die de streamer beluisterd via spotify toont en afspeelt via spotify voor de kijkers. De streamers moeten hun spotify en twitch account linken met hun account op onze website. Daarna een liedje afspelen in hun spotify, en de weblink naar hun profiel op onze site delen via de stream met de kijkers. Ze kunnen hierdoor zonder muziek te streamen op hun twitch account de kijkers muziek van hun keuze aanbieden. De kijkers zullen alleen hun spotify account moeten linken aan hun account op onze website om van de service te genieten.

Hierdoor luisteren ze de muziek met hun spotify account en wordt er dus niet aan "uitzenden van muziek" gedaan door de streamer.

# Acceptance criteria

## Networking

- [x] HTTP requests worden geredirect naar HTTPS
- [x] Het gebruikte domein zal in de HSTS preload list staan
- [x] Domein krijgt minstens een A score bij de [SSL Labs server test](https://www.ssllabs.com/ssltest)
- [x] Gebruik van DNS CAA
- [x] Iedere respons bevat een Strict-Transport-Security header

## Security

- De site zal beveiligd zijn tegen allerlei aanvallen: [source](https://deepurai.medium.com/secure-your-nodejs-applications-d13ef96a3cac)
- [x] Cross-site Scripting (XSS)
- [x] HTTP Parameter Pollution attacks (HPP)
- [x] JSON pollution
- [x] Sanitizing user data (using Express Mongo Sanitize)
- [x] CORS
- [x] DDOS (using Rate limiting)

### API

- [x] Elke OPTIONS succesvolle respons bevat minstens de headers Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin en Vary met hun correcte waarden. De waarde van Access-Control-Allow-Origin is de origin van de request. Een ontbrekende, ongeldige of null origin request header resulteert in een error respons
- [x] De REST APIs implementeren correcte content negotiation: de content-type van de response komt overeen met het media type met het hoogste gewicht in de Accept header dat wordt aangeboden voor de resource. Indien geen van de media types in de Accept header beschikbaar is, dan stuurt de resource server status code 406 terug
- [x] Het application/json media type wordt aangeboden voor alle resources
- [x] De API zal de correcte response status codes gebruiken
- [x] De data, verkrijgbaar via de API, zal enkel via correcte tokens kunnen opgevraagd worden
- [x] De data zal enkel beschikbaar zijn van de frontend d.m.v. CORS

## Functionaliteiten

- [x] Als streamer en kijker ben ik verplicht te registreren om gebruik te kunnen maken van deze app
- [x] Als streamer en kijker ben ik bij de registratie verplicht om mijn Spotify account te linken aan mijn profiel op deze app
- [x] Als streamer en kijker ben ik verplicht in te loggen na registratie
- [x] Wanneer ik als kijker mijn twitch link aan mijn profiel op deze app, wordt ik een streamer
- [ ] Als streamer en kijker heb ik de mogelijkheid om streamers op te zoeken aan de hand van zijn/haar username van Twitch
- [ ] Als streamer en kijker heb ik de mogelijkheid om het profiel van de gevonden streamer te bekijken
- [ ] Als streamer en kijker heb ik de mogelijkheid om op het profiel van de gevonden streamer het lied waarnaar deze streamer aan het luisteren is af te spelen

## Permissions & rights

- [ ] Iedere pagina van de webtoepassing bevat een duidelijk zichtbare link naar de privacyverklaring die de gebruiker informeert over persoonsgegevensverwerking.
- [ ] De applicatie zal conform zijn met de GDPR regels & de ePrivacy richtlijn

# Threat model

![threat_model_ini](https://github.com/EHB-TI/web-app-guns-for-hire/blob/main/images/threat_model_ini.jpg)
![threat_model_api](https://github.com/EHB-TI/web-app-guns-for-hire/blob/main/images/threat_model_api.jpg)

| Threat                     | Tegenmaatregel technologie | Plaats van Threat | Voorbeeld uit diagram                                     | Uitleg                                                                                                                                                             |
| -------------------------- | -------------------------- | ----------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Spoofing**               | Auth0                      | Sign in, Sign up  | CreateAccount & Sign in                                   | We gebruiken Auth0 om de authenticatie af te handelen. Bij deze flow wordt er een token terug gestuurd naar de api waardoor we zeker zijn van de juiste user.      |
| **Tampering**              | JWT-tokens                 | Requesting data   | GetCurrentlyPlayingSong, PlayStreamerSong, SearchStreamer | We gebruiken JWT-tokens om er zeker van te zijn dat de user de correcte data kan opvragen. En dat deze tijdens het request niet aangepast kan worden.              |
| **Repudiation**            | Logging                    | Every request     | Every process                                             | We gebruiken logging om vast te leggen wie welke actie gedaan heeft om de fout te kunnen traceren naar de corresponderende user. (eventueel LogRocket)             |
| **Information Disclosure** | Encryption                 | Sending data      | GetCurrentlyPlayingSong, PlayStreamerSong, SearchStreamer | We gebruiken encryption om er zeker van te zijn dat enkel de opvrager de data kan lezen met zijn key                                                               |
| **Denial of Service**      | Kubernetes                 | Server            | Digital ocean droplet                                     | We gebruiken kubernetes om load balancing te gaan toepassen op de verschillende containers zodat er steeds meerdere instanties zijn en minder kans is op downtime. |
| **Elevation of Privilage** | Roles                      | Express API       | GetCurrentlyPlayingSong, PlayStreamerSong, SearchStreamer | We maken gebruik van rollen om er zeker van te zijn dat een user enkel data kan beheren die voor zijn rol bestemd is.                                              |

# Deployment

De deployment gebeurt via Github Actions (CI/CD).

De app is [hier](https://twitch-radio.xyz) op te vinden.
De api is [hier](https://api.twitch-radio.xyz) op te vinden.

# Testen

Om de app te testen hebben we voor 2 accounts gezorgd omdat bij de spotify api in development mode een beperkt aantal accounts aan de api kunnen.
Indien er wordt geprompt voor een verificatie code bij de login in spotify of twitch, kan je dezelde credentials gebruiken voor outlook.

| Type         | Email                        | Password                          |
| ------------ | ---------------------------- | --------------------------------- |
| **Streamer** | softsec.streamer@hotmail.com | [contacteer ons](#contacteer-ons) |
| **Watcher**  | softsec.watcher@hotmail.com  | [contacteer ons](#contacteer-ons) |

# Contacteer ons

- Tycho Verstraete: tycho.verstraete@student.ehb.be
- Tim Vandergoten: tim.vandergoten@student.ehb.be
