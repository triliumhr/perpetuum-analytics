---
title: Početak
slug: pocetak
order: 1
summary: Instaliraj paket, dodaj jedan provider i vidi prvi prikaz stranice u Google Analyticsu 4.
---

# Početak

Perpetuum Analytics povezuje Angular aplikaciju s Google Analyticsom 4 ili Google Tag Managerom. Siguran je uz renderiranje na serveru (SSR): na serveru ne radi ništa, a u pregledniku učita tag i nakon svake navigacije pošalje prikaz stranice.

## Što treba

- Angular 21 ili 22, standalone ili s NgModulima
- Angular router, za automatske prikaze stranica
- GA4 ID mjerenja (`G-…`) ili ID Tag Manager spremnika (`GTM-…`)

## Instalacija

```bash
npm install @triliumhr/perpetuum-analytics
```

## Dodaj provider

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideAnalytics } from '@triliumhr/perpetuum-analytics'

import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideAnalytics({ tag: 'gtag', measurementId: 'G-XXXXXXXXXX' })],
}
```

To je cijelo postavljanje. U `index.html` ne dodaješ ništa i ništa ne pozivaš iz komponente.

## Jedna postavka u Google Analyticsu

Paket sam šalje prikaz stranice za svaku navigaciju, s naslovom nove rute. Google Analytics zna i sam brojati promjene povijesti preglednika, pa bi svaku navigaciju brojao dvaput. Isključi to jednom:

1. Google Analytics › Admin › Data streams › tvoj web stream
2. Enhanced measurement › ikona zupčanika
3. Page views › Show advanced settings › makni kvačicu s **Page changes based on browser history events** › Save

## Provjeri da radi

Otvori aplikaciju, pa Google Analytics › Reports › Realtime. Svaka navigacija se vidi kao `page_view` s naslovom stranice. Za detaljniji pogled koristi [DebugView](cesta-pitanja#kako-vidim-evente-dok-razvijam).

## Strogi Content Security Policy

Uz Content Security Policy s nonceom, skripta Google taga nosi nonce stranice, pa `script-src` ne treba nijedan Googleov host. Daj Angularu nonce onako kako ga ionako čita: server ga upiše u korijenski element aplikacije, uz isti nonce u zaglavlju `Content-Security-Policy`.

```html
<app-root ngCspNonce="…"></app-root>
```

Angular čita `ngCspNonce` kao `CSP_NONCE`, a skripta koju dodaje `provideAnalytics()` ga dobiva. Isto radi i kad sam daš `CSP_NONCE`. Nonce je nov za svaki odgovor, pa uvijek dolazi sa servera, nikad iz koda aplikacije.

Pravila koja rade s gtag.js:

```text
script-src 'self' 'nonce-…'; connect-src https://*.google-analytics.com https://*.googletagmanager.com; img-src https://*.google-analytics.com https://*.googletagmanager.com
```

Bez `CSP_NONCE` skripta nema nonce, kao i dosad. Tagovi koje kontejner Tag Managera dodaje sam slijede Googleove upute za Content Security Policy uz Tag Manager.

## Dalje

- [Vlastiti eventi](dogadaji), npr. `add_to_cart` i `sign_up`
- [Google Tag Manager](tag-manager) umjesto gtag.js
- [Consent Mode](consent-mode)
- [Zašto je siguran uz SSR](ssr)
