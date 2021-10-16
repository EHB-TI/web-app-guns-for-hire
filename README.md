# Goal

Twitch streamers spelen graag muziek af als achtergrond muziek of om stille momenten te vullen. Het probleem is dat als ze muziek afspelen dat ze kans maken om een DMCA claim te krijgen. Dit kan er voor zorgen dat jouw account wordt verwijderd.

Om dit te vermijden willen wij een website maken dat de muziek die de streamer beluisterd via spotify toont en afspeelt via spotify voor de kijkers. De streamers moeten hun spotify en twitch account linken met hun account op onze website en daarna alleen de link delen via de stream. Ze kunnen hierdoor zonder muziek te streamen op hun twitch account de kijkers muziek van hun keuze aanbieden. De kijkers zullen alleen hun spotify account moeten linken om van de service te genieten.

# Acceptance criteria

## Networking

- [ ] HTTP requests worden geredirect naar HTTPS
- [ ] Het gebruikte domein zal in de HSTS preload list staan
- [ ] Domein krijgt minstens een A score bij de [SSL Labs server test](https://www.ssllabs.com/ssltest)
- [ ] Gebruik van DNS CAA
- [ ] Iedere respons bevat een Strict-Transport-Security header

## Security

### Sign in

- [ ] Het is mogelijk om het wachtwoord te plakken
- [ ] Er kan pas ingelogd worden als de gebruiker aangetoond heeft dat hij of zij het email adres opgegeven tijdens registratie onder controle heeft
- [ ] Het scherm gepresenteerd door de applicatie geeft duidelijk aan of de gebruiker al dan niet aangemeld is
- [ ] Pas na aanmelden kan de gebruiker zijn of haar gegevens opvragen

### Sign up

- [ ] Alle 'printable' ASCII karakters worden aanvaard in het wachtwoord
- [ ] Het wachtwoord wordt enkel aanvaard als het minstens 7 karakters bevat
- [ ] Het is mogelijk om het wachtwoord te plakken (zodat gebruikers een password manager kunnen gebruiken)
- [ ] Vaak gebruikte wachtwoorden worden geweigerd
- [ ] De gebruiker moet bij registratie een email adres opgeven

---

- [ ] De site zal beveiligd zijn tegen allerlei aanvallen:

- CSRF
- XSS
- XSSI
- Clickjacking
- SQL injection
- Command injection
- HTML injection
- CSS injection

### API

- [ ] Elke OPTIONS succesvolle respons bevat minstens de headers Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin en Vary met hun correcte waarden. De waarde van Access-Control-Allow-Origin is de origin van de request. Een ontbrekende, ongeldige of null origin request header resulteert in een error respons
- [ ] De REST APIs implementeren correcte content negotiation: de content-type van de response komt overeen met het media type met het hoogste gewicht in de Accept header dat wordt aangeboden voor de resource. Indien geen van de media types in de Accept header beschikbaar is, dan stuurt de resource server status code 406 terug
- [ ] Het application/json media type wordt aangeboden voor alle resources
- [ ] De API zal de correcte response status codes gebruiken
- [ ] De data, verkrijgbaar via de API, zal enkel via correcte tokens kunnen opgevraagd worden

## Functionaliteiten

- [ ] Men is verplicht om zijn/haar Spotify account na registratie te linken aan zijn/haar account.
- [ ] Men heeft de mogelijkheid om zijn/haar Twitch account te linken aan zijn/haar account.
- [ ] Men heeft de mogelijkheid om een streamer (waarvan zijn/haar account gelinkt is aan deze app) op te zoeken.
- [ ] Men heeft de mogelijkheid om van een streamer (eens gevonden) de track die hij currently aan het afspelen is te beluisteren.

## Permissions & rights

- [ ] Iedere pagina van de webtoepassing bevat een duidelijk zichtbare link naar de privacyverklaring die de gebruiker informeert over persoonsgegevensverwerking.
- [ ] De applicatie zal conform zijn met de GDPR regels & de ePrivacy richtlijn

# Threat model

![threat_model_ini](https://github.com/EHB-TI/web-app-guns-for-hire/blob/main/images/threat_model_ini.jpg)
![threat_model_api](https://github.com/EHB-TI/web-app-guns-for-hire/blob/main/images/threat_model_api.jpg)

| Threat                     | Tegenmaatregel technologie | Plaats van Threat | Voorbeeld uit diagram   | Uitleg                                                                                                                                                             |
| -------------------------- | -------------------------- | ----------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Spoofing**               | Auth0                      | Sign in, Sign up  | CreateAccount           | We gebruiken Auth0 om de authenticatie af te handelen. Bij deze flow wordt er een token terug gestuurd naar de api waardoor we zeker zijn van de juiste user.      |
| **Tampering**              | JWT-tokens                 | Requesting data   | GetCurrentlyPlayingSong | We gebruiken JWT-tokens om er zeker van te zijn dat de user de correcte data kan opvragen. En dat deze tijdens het request niet aangepast kan worden.              |
| **Repudiation**            | Logging                    | Every request     | Every process           | We gebruiken logging om vast te leggen wie welke actie gedaan heeft om de fout te kunnen traceren naar de corresponderende user.                                   |
| **Information Disclosure** | Encryption                 | Sending data      | GetCurrentlyPlayingSong | We gebruiken encryption om er zeker van te zijn dat enkel de opvrager de data kan lezen met zijn key                                                               |
| **Denial of Service**      | Kubernetes                 | Server            | Digital ocean droplet   | We gebruiken kubernetes om load balancing te gaan toepassen op de verschillende containers zodat er steeds meerdere instanties zijn en minder kans is op downtime. |
| **Elevation of Privilage** | Roles                      | Express API       | GetCurrentlyPlayingSong | We maken gebruik van rollen om er zeker van te zijn dat een user enkel data kan beheren die voor zijn rol bestemd is.                                              |

# Deployment

_minimally, this section contains a public URL of the app. A description of how your software is deployed is a bonus. Do you do this manually, or did you manage to automate? Have you taken into account the security of your deployment process?_

# _you may want further sections_

_especially if the use of your application is not self-evident_
