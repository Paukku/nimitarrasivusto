# TEHTÄVÄLISTA
## Nimitarra-verkkokauppasovellus
**Perustuu tekniseen arkkitehtuuriin v1.0**

Merkinnät: `[ ]` = tekemättä · `[x]` = valmis · ⚠️ = riippuvuus edellisestä tehtävästä

---

## EPIC 1 — Projektin rakenne ja konfiguraatio

### T-01 · Monorepo-rakenne
- [x] Luo alihakemistot `frontend/`, `backend/`, `shared/`

### T-02 · Backend — TypeScript-projekti ⚠️ T-01
- [x] `npm init` backend-hakemistossa
- [x] Asenna riippuvuudet: `express cors dotenv uuid zod`
- [x] Asenna dev-riippuvuudet: `typescript ts-node-dev @types/express @types/cors @types/uuid`
- [x] Luo `tsconfig.json` (`target: ES2020`, `outDir: dist`, `rootDir: src`)
- [x] Luo hakemistorakenne: `src/routes/ controllers/ services/ repositories/ middleware/ types/`
- [x] Lisää `package.json` scriptit: `dev` (ts-node-dev), `build` (tsc), `start` (node dist)
- [x] Luo `.env.example` ja `.gitignore` (sisältää `.env`, `node_modules`, `dist`)

### T-03 · Frontend — Vite + React + TypeScript -projekti ⚠️ T-01
- [x] `npm create vite@latest frontend -- --template react-ts`
- [x] Asenna lisäriippuvuudet: `@tanstack/react-query react-router-dom`
- [x] Konfiguroi `vite.config.ts`: lisää proxy `/api` → `http://localhost:3001`
- [x] Luo hakemistorakenne: `src/components/ pages/ hooks/ api/ types/ constants/`
- [x] Poista Viten oletusboilerplate (`App.css`, `index.css` sisältö, `assets/react.svg`)

### T-04 · Jaetut TypeScript-tyypit ⚠️ T-02, T-03
- [x] Luo `shared/types.ts` (tai kopioi molempiin `src/types/index.ts`)
- [x] Määrittele tyypit: `CartItem`, `OrderItem`, `CustomerInfo`, `Order`, `OrderStatus`
- [x] Varmista, että backend ja frontend käyttävät samoja tyyppejä

---

## EPIC 2 — Backend (in-memory)

### T-05 · Middleware ⚠️ T-02
- [ ] Luo `middleware/errorHandler.ts` — globaali Express-virheenkäsittelijä
  - Zod-virheet → 400 + `{ error, details }`
  - Muut virheet → 500 + `{ error: 'Palvelinvirhe' }`
- [ ] Luo `middleware/validateRequest.ts` — Zod-skeema `CreateOrderSchema`
  - Validoi `items[].color` (hex-regex), `items[].text` (max 20), `items[].quantity` (int ≥ 1)
  - Validoi `customerInfo.name` ja `customerInfo.address`

### T-06 · Repository-rajapinta ja in-memory-toteutus ⚠️ T-04
- [ ] Luo `repositories/IOrderRepository.ts` — rajapinta metodeilla `createOrder` ja `getOrderById`
- [ ] Luo `repositories/InMemoryOrderRepository.ts`
  - Sisäinen `Map<string, Order>` -varasto
  - `createOrder`: generoi UUID, aseta `createdAt` ja `status: 'pending'`, tallenna Map:iin
  - `getOrderById`: hae Map:sta, palauta `null` jos ei löydy

### T-07 · Service-kerros ⚠️ T-06
- [ ] Luo `services/orderService.ts`
- [ ] Toteuta `calculateTotalPrice(items)` — `quantity × UNIT_PRICE (10.00)` per rivi, summa yhteen
- [ ] Toteuta `createOrder(data, repository)` — kutsu `calculateTotalPrice`, kutsu `repository.createOrder`
- [ ] Toteuta `getOrderById(id, repository)` — kutsu `repository.getOrderById`, heitä virhe jos `null`

### T-08 · Controller ⚠️ T-05, T-07
- [ ] Luo `controllers/orderController.ts`
- [ ] Toteuta `createOrder`: pura `req.body`, kutsu service, palauta `201 + order`
- [ ] Toteuta `getOrderById`: pura `req.params.id`, kutsu service, palauta `200 + order` tai `404`

### T-09 · Reititys ja app.ts ⚠️ T-08
- [ ] Luo `routes/orderRoutes.ts` — rekisteröi `POST /api/orders` ja `GET /api/orders/:id`
- [ ] Luo `app.ts`:
  - Konfiguroi `cors()`, `express.json()`
  - Rekisteröi `orderRoutes`
  - Lisää `GET /api/health` → `{ status: 'ok' }`
  - Rekisteröi `errorHandler` viimeisenä middlewarena
  - Lue `PORT` `.env`:stä, käynnistä `app.listen`
  - Injektoi `InMemoryOrderRepository` controllerille (tai servicelle)

### T-10 · Manuaalinen API-testaus ⚠️ T-09
- [ ] Käynnistä backend: `npm run dev`
- [ ] Testaa `GET /api/health` → `{ status: 'ok' }`
- [ ] Testaa `POST /api/orders` validilla datalla → 201 + tilausobjekti UUID:lla
- [ ] Testaa `POST /api/orders` virheellisellä datalla (tyhjä teksti, liian pitkä teksti) → 400
- [ ] Testaa `GET /api/orders/:id` olemassaolevalla ID:llä → 200
- [ ] Testaa `GET /api/orders/:id` tuntemattomalla ID:llä → 404

---

## EPIC 3 — Frontend: yhteiset osat

### T-11 · Vakiot ja tyypit ⚠️ T-04
- [ ] Luo `constants/index.ts`:
  - `LABEL_COLORS` — 8 väriä nimineen ja hex-koodeineen
  - `UNIT_PRICE = 10.00`
  - `UNITS_PER_BATCH = 120`
  - `MAX_TEXT_LENGTH = 20`
- [ ] Luo `api/orders.ts` — fetch-wrapperi-funktiot `createOrder(payload)` ja `getOrder(id)`

### T-12 · Reititys ja App.tsx ⚠️ T-03, T-11
- [ ] Konfiguroi `react-router-dom` `App.tsx`:ssä
- [ ] Määrittele reitit: `/` (EditorPage), `/cart` (CartPage), `/checkout` (CheckoutPage), `/confirmation/:orderId` (ConfirmationPage)
- [ ] Lisää `QueryClientProvider` React Querya varten

### T-13 · `useCart`-hook ⚠️ T-04
- [ ] Luo `hooks/useCart.ts`
- [ ] Toteuta `useState` lazy initializer, joka lukee `nimitarra_cart` localStoragesta
- [ ] `try/catch` korruptoituneelle datalle → palauta `[]`
- [ ] Toteuta `persist(next)` — päivittää sekä staten että localStoragen
- [ ] Toteuta `addItem`, `removeItem`, `updateQuantity`, `clearCart` käyttäen `persist`

### T-14 · `useOrders`-hook ⚠️ T-11, T-13
- [ ] Luo `hooks/useOrders.ts`
- [ ] Toteuta `useCreateOrder()` — `useMutation` kutsuu `api/orders.createOrder`
- [ ] Toteuta `useGetOrder(id)` — `useQuery` kutsuu `api/orders.getOrder`

---

## EPIC 4 — Frontend: komponentit

### T-15 · `LabelPreview`-komponentti ⚠️ T-11
- [ ] Luo `components/LabelPreview/LabelPreview.tsx`
- [ ] Props: `color: string`, `text: string`
- [ ] Kiinteä leveys 231 px, korkeus lasketaan kuvasuhteesta `3/1.3` (~100 px)
- [ ] Toteuta `calcFontSize(text, width)` — laskee fonttikoon tekstin pituuden ja containerleveyden perusteella (min 10, max 32)
- [ ] Toteuta `getContrastColor(hex)` — palauttaa `#000` tai `#fff` taustavärin luminanssin mukaan
- [ ] Tyylit: `border-radius: 8px`, `overflow: hidden`, `padding: 0 12px`, teksti `white-space: nowrap`

### T-16 · `ColorPicker`-komponentti ⚠️ T-11, T-15
- [ ] Luo `components/ColorPicker/ColorPicker.tsx`
- [ ] Props: `selectedColor: string`, `onChange: (hex: string) => void`
- [ ] Renderöi `LABEL_COLORS`-vakion värit ruudukkona (esim. 4 × 2)
- [ ] Valitun värin ympärille reunus/korostus
- [ ] Jokainen ruutu on klikattava, kutsuu `onChange(hex)`

### T-17 · `TextInput`-komponentti ⚠️ T-11
- [ ] Luo `components/TextInput/TextInput.tsx`
- [ ] Props: `value: string`, `onChange: (val: string) => void`, `error?: string`
- [ ] Syötteen pituus rajoitettu `MAX_TEXT_LENGTH` (20) merkkiin (`maxLength`-attribuutti + validointi)
- [ ] Näytä merkkimäärälaskuri: `{value.length}/{MAX_TEXT_LENGTH}`
- [ ] Näytä `error`-prop kentän alla punaisella tekstillä jos annettu

### T-18 · `CartItem`-komponentti ⚠️ T-15
- [ ] Luo `components/CartItem/CartItem.tsx`
- [ ] Props: `item: CartItem`, `onRemove: (id) => void`, `onQuantityChange: (id, qty) => void`
- [ ] Näytä pieni `LabelPreview` (voidaan skaalata CSS `transform: scale()`)
- [ ] Näytä teksti, väri hex, kappalemäärä × 120 kpl
- [ ] Poistopainike kutsuu `onRemove`
- [ ] Määrän muutos (+ / − tai numerokenttä) kutsuu `onQuantityChange`

---

## EPIC 5 — Frontend: sivut

### T-19 · `EditorPage` ⚠️ T-13, T-15, T-16, T-17
- [ ] Luo `pages/EditorPage/EditorPage.tsx`
- [ ] Paikallinen tila: `selectedColor` (oletuksena ensimmäinen väri), `text` (oletuksena `''`)
- [ ] Renderöi `ColorPicker`, `TextInput`, `LabelPreview` rinnakkain tai allekkain
- [ ] Validointi "Lisää koriin" -napin klikkauksessa: teksti ei tyhjä
- [ ] Onnistunut validointi: `useCart.addItem({ id: uuid(), color, text, quantity: 1 })`
- [ ] Lisäyksen jälkeen nollaa `text`-tila, näytä lyhyt vahvistusviesti ("Lisätty ostoskoriin!")
- [ ] Linkki ostoskoriin (`/cart`)

### T-20 · `CartPage` ⚠️ T-13, T-18
- [ ] Luo `pages/CartPage/CartPage.tsx`
- [ ] Hae ostoskorin sisältö `useCart`-hookista
- [ ] Jos kori tyhjä, näytä viesti ja linkki takaisin muokkausnäkymään
- [ ] Renderöi lista `CartItem`-komponentteja
- [ ] Laske ja näytä yhteissumma: `items.reduce((sum, i) => sum + i.quantity * UNIT_PRICE, 0)` €
- [ ] "Tilaa"-painike navigoi `/checkout`-sivulle

### T-21 · `CheckoutPage` ⚠️ T-14, T-20
- [ ] Luo `pages/CheckoutPage/CheckoutPage.tsx`
- [ ] Paikallinen tila: `name`, `address`, validointivirheet
- [ ] Renderöi lomake: nimi-kenttä, osoite-kenttä
- [ ] Validointi lähetyksessä: molemmat kentät täytettyjä
- [ ] `useCreateOrder().mutate({ items: cart.items, customerInfo: { name, address } })`
- [ ] Latauksen aikana: poista "Vahvista"-painike käytöstä, näytä spinner
- [ ] `onSuccess`: kutsu `clearCart()`, navigoi `/confirmation/:orderId`
- [ ] `onError`: näytä virheilmoitus lomakkeen alla

### T-22 · `ConfirmationPage` ⚠️ T-14, T-21
- [ ] Luo `pages/ConfirmationPage/ConfirmationPage.tsx`
- [ ] Lue `orderId` URL-parametrista (`useParams`)
- [ ] `useGetOrder(orderId)` hakee tilauksen tiedot backendistä
- [ ] Latauksen aikana: näytä spinner
- [ ] Onnistuneesti: näytä tilausnumero, yhteenveto (tuotteet, yhteissumma, toimitusosoite), kiitosviesti
- [ ] Virhetilanteessa: näytä virheilmoitus

---

## EPIC 6 — Integraatiotestaus (end-to-end)

### T-23 · Koko tilauspolun testaus ⚠️ kaikki edeltävät
- [ ] Käynnistä backend ja frontend samanaikaisesti
- [ ] Muokkausnäkymä: valitse väri, kirjoita teksti, lisää koriin — tarkista localStorage
- [ ] Ostoskorinäkymä: tarkista tuote näkyy oikein, muuta määrä, poista tuote
- [ ] Checkout: täytä yhteystiedot, lähetä tilaus — tarkista backend tallentaa
- [ ] Vahvistussivu: tarkista tilausnumero ja yhteenveto näkyvät
- [ ] Päivitä sivu — tarkista localStorage-ostoskori säilyy
- [ ] Virhekäsittely: kokeile lähettää tyhjä lomake, yli 20 merkin teksti

---

## EPIC 7 — PostgreSQL-migraatio

### T-24 · PostgreSQL-ympäristö ⚠️ EPIC 6 valmis
- [ ] Asenna PostgreSQL (tai käynnistä Docker-kontissa)
- [ ] Luo tietokanta: `createdb nimitarra`
- [ ] Kopioi `DATABASE_URL` `.env`-tiedostoon

### T-25 · SQL-skeema ja migraatio ⚠️ T-24
- [ ] Luo `backend/migrations/001_create_orders.sql`
- [ ] Taulut: `orders` (id, created_at, status, total_price, customer_name, customer_address)
- [ ] Taulut: `order_items` (id, order_id FK, color, text, quantity, unit_price)
- [ ] Indeksi: `idx_order_items_order_id`
- [ ] Aja migraatio: `psql nimitarra < migrations/001_create_orders.sql`

### T-26 · `PostgresOrderRepository` ⚠️ T-25
- [ ] Luo `repositories/PostgresOrderRepository.ts`
- [ ] Lisää `pg`-paketti: `npm install pg && npm install -D @types/pg`
- [ ] Toteuta `createOrder` transaktiolla: INSERT orders → INSERT order_items (loop) → COMMIT
- [ ] Rollback virhetilanteessa
- [ ] Toteuta `getOrderById`: JOIN orders + order_items, mappaa rivi `Order`-tyypiksi
- [ ] Toteuta `mapRowToOrder`-apufunktio

### T-27 · Repository-vaihto ja testaus ⚠️ T-26
- [ ] Vaihda `app.ts`:ssa `InMemoryOrderRepository` → `PostgresOrderRepository`
- [ ] Luo `pg.Pool` `DATABASE_URL`:sta
- [ ] Toista T-23:n testit PostgreSQL-backendillä
- [ ] Tarkista tiedot suoraan tietokannasta: `SELECT * FROM orders; SELECT * FROM order_items;`

---

## EPIC 8 — Viimeistely

### T-28 · Ympäristömuuttujat ja konfiguraatio ⚠️ T-27
- [ ] Varmista, että `.env` ei ole versionhallinnassa (`.gitignore`)
- [ ] Päivitä `.env.example` kaikilla tarvittavilla muuttujilla
- [ ] Lisää `DB_DRIVER`-muuttuja (`memory` / `postgres`) helpottamaan vaihtoa

### T-29 · README ⚠️ T-28
- [ ] Projektin kuvaus
- [ ] Vaatimukset (Node.js versio, PostgreSQL)
- [ ] Asennusohjeet (`npm install` frontend + backend)
- [ ] Käynnistysohjeet (dev-tila)
- [ ] Ympäristömuuttujien kuvaus
- [ ] Lyhyt kuvaus arkkitehtuurista

---

## Yhteenveto

| Epic | Tehtäviä | Riippuu |
|---|---|---|
| 1 — Projektin rakenne | T-01 … T-04 | — |
| 2 — Backend (in-memory) | T-05 … T-10 | Epic 1 |
| 3 — Frontend: yhteiset osat | T-11 … T-14 | Epic 1 |
| 4 — Frontend: komponentit | T-15 … T-18 | Epic 3 |
| 5 — Frontend: sivut | T-19 … T-22 | Epic 4 + Backend |
| 6 — Integraatiotestaus | T-23 | Kaikki edeltävät |
| 7 — PostgreSQL-migraatio | T-24 … T-27 | Epic 6 |
| 8 — Viimeistely | T-28 … T-29 | Epic 7 |

**Suositeltu järjestys:** Epic 1 → Epic 2 + Epic 3 rinnakkain → Epic 4 → Epic 5 → Epic 6 → Epic 7 → Epic 8