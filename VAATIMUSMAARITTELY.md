# VAATIMUSMÄÄRITTELY
## Nimitarra-verkkokauppasovellus
**Versio 1.1**

| | |
|---|---|
| **Projekti** | Nimitarra-verkkokauppasovellus |
| **Versio** | 1.1 — Päivitetty avointen kysymysten päätöksillä |
| **Teknologiat** | Node.js, Express.js, TypeScript, React, ReactQuery, PostgreSQL |

---

## 1. Johdanto ja projektin kuvaus

Tämä dokumentti kuvaa nimitarra-verkkokauppasovelluksen toiminnalliset ja ei-toiminnalliset vaatimukset. Sovellus mahdollistaa käyttäjälle henkilökohtaisen nimitarran suunnittelun ja tilaamisen verkossa.

Käyttäjä voi valita tarran taustavärin sekä kirjoittaa haluamansa lyhyen tekstin (maksimissaan 20 merkkiä). Tilattu tuote tallennetaan ensin ostoskoriin (localStorage), ja kun käyttäjä vahvistaa tilauksen, tiedot persistoidaan tietokantaan.

### 1.1 Projektin laajuus (scope)

- Nimitarran muokkausnäkymä (väri + teksti)
- Reaaliaikainen esikatselu tarrasta oikeassa kuvasuhteessa (3 × 1,3 cm)
- Ostoskorin hallinta (lisäys, poisto, määrän muutos) — tallennetaan localStorageen
- Tilauksen tekeminen ja vahvistus
- Tietojen tallennus tietokantaan tilauksen yhteydessä
- REST API backend tilausten käsittelyyn

### 1.2 Myöhemmin toteutettavaa (V2+)

- Kuvan lisääminen tarraan
- Käyttäjätunnukset ja kirjautuminen
- Maksuintegraatiot
- Sähköpostivahvistukset
- Tilaushistoria
- Admin-paneeli

---

## 2. Teknologia-arkkitehtuuri

| Kerros | Teknologia | Huomiot |
|---|---|---|
| Frontend | React + TypeScript | Komponenttipohjainen UI, vahva tyypitys |
| State & data fetching | React Query (TanStack Query) | Palvelintilatiedon hallinta, välimuistitus, optimistinen päivitys |
| Ostoskorin persistointi | localStorage | Säilyy sivun päivityksen yli, ei vaadi backendia |
| Backend | Node.js + Express.js + TypeScript | RESTful API, middlewaret, reititys |
| Tietokanta (vaihe 1) | In-memory (Map/array) | Nopea kehitysaloitus, ei asennuksia |
| Tietokanta (vaihe 2) | PostgreSQL | Tuotantovalmis, persistoitu tallennus |
| API-viestintä | REST / JSON | Selkeä sopimus frontendin ja backendin välillä |

### 2.1 Arkkitehtuurikuvaus

Sovellus noudattaa selkeää kerrosarkkitehtuuria:

- Frontend (React) kommunikoi backendin kanssa React Queryn kautta HTTP-pyyntöinä
- Backend (Express) vastaanottaa pyynnöt, validoi datan ja ohjaa sen tietokantakerrokselle
- Tietokantakerros abstrahoidaan **repository-patternia** käyttäen, jolloin in-memory → PostgreSQL vaihto ei vaadi muutoksia controller-koodiin
- Ostoskori hallitaan frontendin localStoragessa — ei backendia tarvita ostoskorin tallennukseen ennen tilausta

---

## 3. Tuotemäärittely — Nimitarra

| Ominaisuus | Arvo |
|---|---|
| **Koko** | 3 × 1,3 cm |
| **Muoto** | Suorakulmio, pyöristetyt kulmat |
| **Teksti** | Vapaa teksti, max 20 merkkiä |
| **Fontti** | Skaalautuu automaattisesti tekstin pituuden mukaan — mahtuu aina tarran sisälle |
| **Väri** | Käyttäjän valitsema taustaväri (väripaletista) |
| **Hinta** | 10 € / 120 kpl (kiinteä) |
| **Kuva (V2)** | Käyttäjä voi lisätä oman kuvan tarraan myöhemmässä versiossa |

### 3.1 Tarran esikatselu UI:ssa

Esikatselu renderöidään oikeassa kuvasuhteessa (3:1,3 ≈ 2,31:1). Fonttikoko lasketaan dynaamisesti tekstin pituuden perusteella niin, että teksti ei koskaan ylitä tarran reunoja. Pyöristetyt kulmat toteutetaan CSS `border-radius`-arvolla.

---

## 4. Toiminnalliset vaatimukset

Prioriteettiluokitus: **Korkea** = pakollinen MVP:ssä, **Keskitaso** = tärkeä mutta ei blokkeri, **Matala** = nice-to-have

### Nimitarran muokkaus

| ID | Vaatimus | Kuvaus | Prioriteetti | Vaihe |
|---|---|---|---|---|
| F-01 | Värin valinta | Käyttäjä voi valita tarran taustavärin ennalta määrätyistä vaihtoehdoista (väripaletti). Valittu väri näkyy välittömästi esikatselussa. | Korkea | MVP |
| F-02 | Tekstin syöttö | Käyttäjä voi kirjoittaa vapaan tekstin tekstikenttään. Maksimipituus on 20 merkkiä. Kenttä laskee ja näyttää jäljellä olevat merkit. | Korkea | MVP |
| F-03 | Reaaliaikainen esikatselu | Muokkausnäkymässä näytetään live-esikatselu tarrasta oikeassa kuvasuhteessa (3 × 1,3 cm), pyöristetyillä kulmilla, valitulla taustavärillä ja automaattisesti skaalautuvalla tekstillä. | Korkea | MVP |
| F-04 | Validointi | Käyttäjää estetään lähettämästä tyhjää tekstiä tai yli 20 merkin tekstiä. Virheviesti näytetään selkeästi. | Korkea | MVP |
| F-05 | Useita värivaihtoehtoja | Väripaletti sisältää vähintään 8 ennalta määrättyä värivaihtoehtoa. Värit tallennetaan hex-muodossa. | Keskitaso | MVP |
| F-06 | Dynaaminen fonttiskaalaus | Tekstin fonttikoko pienenee automaattisesti merkkimäärän kasvaessa niin, että teksti pysyy aina tarran suorakulmion sisällä. | Korkea | MVP |
| F-07 | Kuvan lisäys tarraan | Käyttäjä voi ladata oman kuvan tarraan tekstin lisäksi tai sijaan. | Keskitaso | V2 |

### Ostoskori

| ID | Vaatimus | Kuvaus | Prioriteetti | Vaihe |
|---|---|---|---|---|
| F-08 | Lisäys ostoskoriin | Käyttäjä voi lisätä muokkaamansa tarran ostoskoriin painikkeella. | Korkea | MVP |
| F-09 | Ostoskorin persistointi | Ostoskori tallennetaan selaimen localStorageen — sisältö säilyy sivun päivityksen tai välilehden sulkemisen yli. | Korkea | MVP |
| F-10 | Ostoskorin tarkastelu | Käyttäjä voi avata ostoskorinäkymän ja nähdä lisätyt tuotteet (esikatselu, teksti, väri, kappalemäärä á 120 kpl, yksikköhinta 10 €, yhteissumma). | Korkea | MVP |
| F-11 | Tuotteen poisto korista | Käyttäjä voi poistaa yksittäisen tuotteen ostoskorista. | Korkea | MVP |
| F-12 | Määrän muuttaminen | Käyttäjä voi muuttaa tilauserien määrää ostoskorissa (1 erä = 120 kpl = 10 €). | Keskitaso | MVP |
| F-13 | Korin tyhjennys | Käyttäjä voi tyhjentää koko ostoskorin kerralla. | Matala | V2 |

### Tilaus ja tietokanta

| ID | Vaatimus | Kuvaus | Prioriteetti | Vaihe |
|---|---|---|---|---|
| F-14 | Tilauksen tekeminen | Käyttäjä voi vahvistaa tilauksen ostoskorista. Tilauksen yhteydessä pyydetään tarvittavat yhteystiedot (nimi, osoite). | Korkea | MVP |
| F-15 | Tilauksen tallennus | Vahvistuksen jälkeen backend tallentaa tilauksen tiedot tietokantaan (tarran väri, teksti, määrä, yksikköhinta, yhteissumma, yhteystiedot, aikaleima). | Korkea | MVP |
| F-16 | Tilausvahvistus UI:ssa | Onnistuneen tilauksen jälkeen käyttäjälle näytetään vahvistussivu tilausnumerolla. localStorage tyhjennetään tilauksen jälkeen. | Korkea | MVP |
| F-17 | Tilauksen haku | Backend tarjoaa endpointin, jolla voi hakea tilauksen tiedot tilausnumerolla. | Keskitaso | MVP |

---

## 5. Ei-toiminnalliset vaatimukset

### 5.1 Suorituskyky
- API-vastaukset alle 300 ms normaaleissa oloissa
- Frontendin ensimmäinen lataus (FCP) alle 2 sekuntia
- Reaaliaikainen esikatselu ja fonttiskaalaus päivittyvät välittömästi ilman havaittavaa viivettä

### 5.2 Luotettavuus ja virheenkäsittely
- Backend palauttaa asianmukaiset HTTP-statuskoodit (200, 201, 400, 404, 500)
- Frontend näyttää käyttäjäystävälliset virheilmoitukset API-virheissä
- Syötteiden validointi tehdään sekä frontendissä että backendissä
- localStorage-lukuvirheet käsitellään gracefully (korruptoitunut data nollataan)

### 5.3 Skaalautuvuus ja ylläpidettävyys
- Repository-pattern tietokantakerroksessa: in-memory vaihdettavissa PostgreSQL:ään ilman muutoksia controller-logiikkaan
- TypeScript koko stackissa: selkeät rajapintamäärittelyt ja tyypit
- Ympäristömuuttujat (`.env`) konfiguraatiolle (tietokantayhteys, portit)

### 5.4 Tietoturva
- Kaikkien syötteiden sanitointi SQL-injektioiden estämiseksi (vaihe 2)
- CORS-konfiguraatio rajattu sallituille origineille
- Tilausdatan validointi Zod- tai Joi-kirjastolla backendissä

---

## 6. REST API -määrittely

Kaikki endpointit palauttavat JSON-muotoista dataa. Base URL kehitysvaiheessa: `http://localhost:3001/api`

| Metodi | Endpoint | Kuvaus | Request body / Response |
|---|---|---|---|
| `POST` | `/api/orders` | Luo uusi tilaus tietokantaan | Body: `{ items, customerInfo }` → 201 + `{ orderId }` |
| `GET` | `/api/orders/:id` | Hae tilaus tilausnumerolla | → 200 + tilaustiedot tai 404 |
| `GET` | `/api/health` | Palvelun tilatarkistus | → 200 + `{ status: 'ok' }` |

### 6.1 Tietomalli — Order

| Kenttä | Tyyppi | Kuvaus |
|---|---|---|
| `id` | string (UUID) | Tilauksen yksilöllinen tunniste |
| `createdAt` | Date (ISO 8601) | Tilauksen luontiaika |
| `items` | OrderItem[] | Tilatut tuotteet (taulukko) |
| `items[].color` | string (hex) | Tarran väri, esim. `#FF5733` |
| `items[].text` | string (max 20) | Tarran teksti |
| `items[].quantity` | number | Tilauserien määrä (1 erä = 120 kpl) |
| `items[].unitPrice` | number | Yksikköhinta euroina (`10.00`) |
| `customerInfo.name` | string | Tilaajan nimi |
| `customerInfo.address` | string | Toimitusosoite |
| `totalPrice` | number | Tilauksen kokonaissumma euroina |
| `status` | enum | `pending` \| `confirmed` \| `shipped` |

---

## 7. Käyttöliittymän vaatimukset

### 7.1 Näkymät
- **Muokkausnäkymä:** värinvalitsin + tekstikenttä + live-esikatselu (oikea kuvasuhde 3:1,3) + "Lisää koriin" -painike
- **Ostoskorinäkymä:** lista tuotteista esikatseluineen, erämäärä, yhteissumma, "Tilaa" -painike
- **Yhteystietonäkymä:** nimi- ja osoitekenttä + tilausvahvistuspainike
- **Vahvistusnäkymä:** tilausnumero ja kiitosviesti

### 7.2 UX-vaatimukset
- Väripaletti esitetään visuaalisina väriruutuina, ei dropdown-valikkoina
- Merkkimäärälaskuri näkyy reaaliajassa tekstikentän alapuolella (esim. `14/20`)
- Tarran esikatselu näyttää aina oikean kuvasuhteen (3 × 1,3 cm) pyöristetyillä kulmilla
- Fontti skaalautuu automaattisesti — käyttäjä ei säädä sitä itse
- Ostoskorin tuotteiden esikatselut näyttävät valitun värin ja tekstin
- Kaikki lomakevirheet näytetään kentän vieressä, ei alert-dialogeina
- Tilauksen lähettämisen aikana käyttöliittymä näyttää latausilmaisimen
- Hinta näytetään selkeästi: `10 € / 120 kpl` — ei kappalehintaa

---

## 8. Tehdyt päätökset

| # | Kysymys | Päätös |
|---|---|---|
| 1 | Ostoskorin tallennus | **localStorage** — säilyy sivun päivityksen yli |
| 2 | ORM/kirjasto PostgreSQL:lle | Auki — Prisma vs. pg/node-postgres |
| 3 | Hinnoittelu | **Kiinteä hinta: 10 € / 120 kpl** |
| 4 | Tarran muoto ja koko | **Suorakulmio, pyöristetyt kulmat, 3 × 1,3 cm** |
| 5 | Fontin skaalaus | **Automaattinen** — fonttikoko mukautuu tekstin pituuden mukaan |
| 6 | Kuvan lisäys | **V2** — toteutetaan myöhemmässä vaiheessa |