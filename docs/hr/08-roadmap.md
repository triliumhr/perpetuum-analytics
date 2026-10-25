---
title: Plan razvoja
slug: plan-razvoja
order: 8
summary: Što dolazi u Perpetuum Analyticsu i kako podržavamo verzije Angulara.
---

# Plan razvoja

Svaka stavka postaje GitHub issue u svojoj prekretnici, a svako izdanje u changelogu navodi što je donijelo. Ideje i glasovi su dobrodošli u [GitHub issueima](https://github.com/triliumhr/perpetuum-analytics/issues).

## Sad: 3.0

GA4 i Google Tag Manager sigurni uz SSR, s `provideAnalytics()`, vlastitim eventima, Consent Modeom v2, 100 % pokrivenosti i end-to-end testom SSR-a na svakom pull requestu. Vidi [Kako testiramo](kako-testiramo).

## Sljedeće: 3.1, privatnost i strogi webovi

- **CSP nonce:** skripta Google taga nosi Angularov `CSP_NONCE`, pa web sa strogim Content Security Policyjem ne treba iznimku za cijeli host.
- **Čiste adrese:** opcija `pageLocation` koja uklanja parametre upita ili maskira dijelove puta prije nego odu Googleu, npr. e-mail u `?email=` ili broj narudžbe u `/narudzbe/:id`.
- **Start nakon privole:** `start: 'manual'` i `analytics.start()`, pa se ništa ne učitava dok posjetitelj ne pristane, za webove koji to biraju umjesto [Consent Modea](consent-mode).

## Zatim: 3.2, bogatije mjerenje

- **Tipizirani GA4 eventi:** preporučeni eventi i eventi webshopa (`purchase`, `add_to_cart`, `begin_checkout`…) s tipiziranim parametrima i `items`.
- **ID korisnika i korisnička svojstva** za prijavljene posjetitelje.
- **Debug mode** kao opcija, bez ekstenzije preglednika.
- **Podaci rute:** ruta može preimenovati svoj prikaz stranice, postaviti vlastiti naslov ili ga preskočiti.

## Kasnije: razmatramo

- Pomoćnik za testove koji bilježi evente u testovima aplikacija koje koriste paket.
- Server-side tagging (vlastiti `transport_url`).
- Drugi alati za mjerenje iza istog API-ja, ako ih korisnici zatraže.

## Podrška verzijama

- Svaka glavna verzija Angulara podržana je od prvog stabilnog izdanja, a dvije najnovije podržane su istodobno (sad 21 i 22).
- Sigurnosne ispravke dolaze prve, kao patch izdanje trenutne glavne verzije.
- Promjena koja traži prilagodbu dolazi samo u novoj glavnoj verziji, uz [vodič za prijelaz](migracija).
