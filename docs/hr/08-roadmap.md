---
title: Plan razvoja
slug: plan-razvoja
order: 8
summary: Što dolazi u Perpetuum Analyticsu i kako podržavamo verzije Angulara.
---

# Plan razvoja

Svaka stavka postaje GitHub issue u svojoj prekretnici, a svako izdanje u changelogu navodi što je donijelo. Ideje i glasovi su dobrodošli u [GitHub issueima](https://github.com/triliumhr/perpetuum-analytics/issues). Kvartali su ciljevi; [vremenska crta](https://github.com/orgs/triliumhr/projects/3/views/2) ih pokazuje na jednom mjestu.

## Sad: 3.0, 4. kvartal 2026.

GA4 i Google Tag Manager sigurni uz SSR, s `provideAnalytics()`, vlastitim eventima, Consent Modeom v2, ručnim startom nakon privole, imenima iz 2.x za postojeće Tag Manager spremnike, CSP nonceom, 100 % pokrivenosti i end-to-end testom SSR-a na svakom pull requestu. Vidi [Kako testiramo](kako-testiramo).

## Sljedeće: 3.1, čišće adrese, 4. kvartal 2026.

- **Čiste adrese:** opcija `pageLocation` koja uklanja parametre upita ili maskira dijelove puta prije nego odu Googleu, npr. e-mail u `?email=` ili broj narudžbe u `/narudzbe/:id`.

## Zatim: 3.2, bogatije mjerenje, 1. kvartal 2027.

- **Tipizirani GA4 eventi:** preporučeni eventi i eventi webshopa (`purchase`, `add_to_cart`, `begin_checkout`…) s tipiziranim parametrima i `items`.
- **ID korisnika i korisnička svojstva** za prijavljene posjetitelje.
- **Debug mode** kao opcija, bez ekstenzije preglednika.
- **Podaci rute:** ruta može preimenovati svoj prikaz stranice, postaviti vlastiti naslov ili ga preskočiti.

## Kasnije: razmatramo

- Pomoćnik za testove koji bilježi evente u testovima aplikacija koje koriste paket.
- Server-side tagging (vlastiti `transport_url`).
- Eventi poslani sa servera kroz GA4 Measurement Protocol, npr. kupnja potvrđena na backendu, uz privolu posjetitelja iz preglednika i API tajnu koja ostaje na serveru.
- Drugi alati za mjerenje iza istog API-ja, ako ih korisnici zatraže.

## Podrška verzijama

- Svaka glavna verzija Angulara podržana je od prvog stabilnog izdanja, a dvije najnovije podržane su istodobno (sad 21 i 22).
- Sigurnosne ispravke dolaze prve, kao patch izdanje trenutne glavne verzije.
- 2.x (`perpetuum-analytics`) dobiva samo sigurnosne zakrpe, do 30. travnja 2027.
- Promjena koja traži prilagodbu dolazi samo u novoj glavnoj verziji, uz [vodič za prijelaz](migracija).
