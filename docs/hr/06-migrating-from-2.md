---
title: Prijelaz s 2.x
slug: migracija
order: 6
summary: Što je novo u 3.0, što je uklonjeno i kako prebaciti aplikaciju u nekoliko minuta.
---

# Prijelaz s 2.x

Verzija 3 ima novo ime paketa, manji API i MIT licencu. Verzija 2.x ostaje na npm-u kao `perpetuum-analytics` i dalje radi, pa prelaziš kad ti odgovara.

## Promjene koje traže prilagodbu

| 2.x                                                                 | 3.x                                                          |
| ------------------------------------------------------------------- | ------------------------------------------------------------ |
| `npm i perpetuum-analytics`                                         | `npm i @triliumhr/perpetuum-analytics`                       |
| `AnalyticsModule.forRoot({ trackingId, trackingType: 'gtag' })`     | `provideAnalytics({ tag: 'gtag', measurementId })`           |
| `trackingType: 'gtm'` uz vlastiti isječak                           | `provideAnalytics({ tag: 'gtm', containerId })`, bez isječka |
| `analytics.setGoogleAnalyticsScripts()` u `AppComponent`            | ništa, provider kreće sam                                    |
| `sendEvent({ eventCategory, eventAction, eventLabel, eventValue })` | `analytics.event(name, params)`                              |
| `[perpetuumAnalytics]="{ … }"`                                      | `perpetuumTrack="name"` uz `[perpetuumTrackParams]`          |
| `trackingType: 'analytics'` (analytics.js)                          | uklonjeno, Google je ugasio Universal Analytics              |
| Angular 13 i noviji                                                 | Angular 21 i 22                                              |
| GPL-3.0                                                             | MIT                                                          |

## Korak po korak

1. Zamijeni paket:

    ```bash
    npm uninstall perpetuum-analytics
    npm install @triliumhr/perpetuum-analytics
    ```

2. Zamijeni `AnalyticsModule.forRoot(…)` s `provideAnalytics(…)` u providerima aplikacije. U aplikaciji s NgModulima ide u `providers` glavnog modula.
3. Makni poziv `setGoogleAnalyticsScripts()`.
4. Prepiši evente. Event iz 2.x s kategorijom, radnjom i oznakom postaje GA4 event nazvan po radnji:

    ```ts
    // 2.x
    this.analytics.sendEvent({ eventCategory: 'Cart', eventAction: 'add_to_cart', eventLabel: item.name, eventValue: item.price })
    // 3.x
    this.analytics.event('add_to_cart', { currency: 'EUR', value: item.price, items: [{ item_name: item.name }] })
    ```

5. Zamijeni `[perpetuumAnalytics]` s `perpetuumTrack` i uvezi `TrackEvent` gdje ga koristiš.
6. Isključi prikaze stranica iz povijesti preglednika u GA4, kao u [Početku](pocetak#jedna-postavka-u-google-analyticsu).

## Ako si tag učitavao tek nakon privole

U 2.x neke su aplikacije zvale `setGoogleAnalyticsScripts()` tek kad je posjetitelj pristao. U 3.x koristi [Consent Mode](consent-mode): tag se učita sa svime na `denied` i slijedi izbor.
