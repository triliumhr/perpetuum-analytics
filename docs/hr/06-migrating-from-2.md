---
title: Prijelaz s 2.x
slug: migracija
order: 6
summary: Što je novo u 3.0, što je uklonjeno i kako prebaciti aplikaciju u nekoliko minuta.
---

# Prijelaz s 2.x

Verzija 3 ima novo ime paketa, manji API i MIT licencu, a zadržava sve što je 2.x radio za GA4 i Tag Manager. Verzija 2.x ostaje na npm-u kao `perpetuum-analytics` i dalje radi, pa prelaziš kad ti odgovara, prije kraja njezine podrške (vidi odjeljak „Podrška za 2.x” na kraju).

## Promjene koje traže prilagodbu

| 2.x                                                                 | 3.x                                                                 |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `npm i perpetuum-analytics`                                         | `npm i @triliumhr/perpetuum-analytics`                              |
| `AnalyticsModule.forRoot({ trackingId, trackingType: 'gtag' })`     | `provideAnalytics({ tag: 'gtag', measurementId })`                  |
| `trackingType: 'gtm'` uz vlastiti isječak                           | `provideAnalytics({ tag: 'gtm', containerId })`, bez isječka        |
| `analytics.setGoogleAnalyticsScripts()` u `AppComponent`            | provider kreće sam, ili na `analytics.start()` uz `start: 'manual'` |
| `setGoogleAnalyticsScripts()` pozvan nakon privole                  | `start: 'manual'` i `analytics.start()`                             |
| GTM data layer `pageview` i `GAEvent`                               | imena GA4, ili ona iz 2.x uz `legacyEventNames: true`               |
| `sendEvent({ eventCategory, eventAction, eventLabel, eventValue })` | `analytics.event(name, params)`                                     |
| `[perpetuumAnalytics]="{ … }"`                                      | `perpetuumTrack="name"` uz `[perpetuumTrackParams]`                 |
| `trackingType: 'analytics'` (analytics.js)                          | uklonjeno, Google je ugasio Universal Analytics                     |
| Angular 13 i noviji                                                 | Angular 21 i 22                                                     |
| GPL-3.0                                                             | MIT                                                                 |

## Korak po korak

1. Zamijeni paket:

    ```bash
    npm uninstall perpetuum-analytics
    npm install @triliumhr/perpetuum-analytics
    ```

2. Zamijeni `AnalyticsModule.forRoot(…)` s `provideAnalytics(…)` u providerima aplikacije. U aplikaciji s NgModulima ide u `providers` glavnog modula.
3. Makni poziv `setGoogleAnalyticsScripts()`. Ako ga je aplikacija zvala tek kad je posjetitelj pristao, vidi odjeljak „Ako si tag učitavao tek nakon privole” ispod.
4. Prepiši evente. Event iz 2.x s kategorijom, radnjom i oznakom postaje GA4 event nazvan po radnji:

    ```ts
    // 2.x
    this.analytics.sendEvent({ eventCategory: 'Cart', eventAction: 'add_to_cart', eventLabel: item.name, eventValue: item.price })
    // 3.x
    this.analytics.event('add_to_cart', { currency: 'EUR', value: item.price, items: [{ item_name: item.name }] })
    ```

5. Zamijeni `[perpetuumAnalytics]` s `perpetuumTrack` i uvezi `TrackEvent` gdje ga koristiš.
6. Isključi prikaze stranica iz povijesti preglednika u GA4, kao u [Početku](pocetak#jedna-postavka-u-google-analyticsu).

## Uz Google Tag Manager: osvježi kontejner

U 3.x data layer govori jezikom GA4. Kontejner složen za 2.x sluša druga imena, pa izaberi jedan od dva puta.

### Zadrži kontejner kakav jest

Dodaj jednu opciju i data layer dobiva imena iz 2.x, pa kontejner broji i dalje, bez izmjene:

```ts
provideAnalytics({ tag: 'gtm', containerId: 'GTM-XXXXXXX', legacyEventNames: true })
```

Prikazi stranica stižu kao `{ event: 'pageview', page: { path, title } }`, a eventi kao `{ event: 'GAEvent', eventCategory, eventAction, eventLabel, eventValue }`. `analytics.event('add_to_cart', { event_category: 'Cart', event_label: item.name, value: item.price })` ih puni: ime postaje `eventAction`, a `event_category`, `event_label` i `value` ostala tri; svaki drugi parametar ostaje uz njih. To je najbrži prijelaz, a kontejner može prijeći na imena GA4 kasnije, kad tebi odgovara.

### Prebaci kontejner na imena GA4

Okidači i varijable koji slušaju imena iz 2.x trebaju jednu prilagodbu:

| Data layer u 2.x                                                           | Data layer u 3.x                                     |
| -------------------------------------------------------------------------- | ---------------------------------------------------- |
| `{ event: 'pageview', page: { path, title } }`                             | `{ event: 'page_view', page_location, page_title }`  |
| `{ event: 'GAEvent', eventCategory, eventAction, eventLabel, eventValue }` | `{ event: 'add_to_cart', …params }`, po imenu eventa |

1. U kontejneru dodaj okidače za nova imena uz stare: vlastiti event `page_view` i po jedan vlastiti event za svako ime eventa koje šalješ.
2. Usmjeri varijable na `page_location` (cijela adresa) i `page_title` umjesto `page.path` i `page.title`.
3. Objavi kontejner, zatim objavi aplikaciju s 3.x, pa makni stare okidače. Tako se nijedan prikaz stranice ne izgubi dok se to dvoje susreće.

## Ako si tag učitavao tek nakon privole

U 2.x neke su aplikacije zvale `setGoogleAnalyticsScripts()` tek kad je posjetitelj pristao. U 3.x je to `start: 'manual'`, a `analytics.start()` ide ondje gdje je bio stari poziv:

```ts
provideAnalytics({ tag: 'gtag', measurementId: 'G-XXXXXXXXXX', start: 'manual' })

// kad posjetitelj dopusti statistiku
inject(Analytics).start()
```

Do tada se od Googlea ništa ne učitava i eventi se ne šalju. Nakon `start()` tag se učita jednom i broji stranicu na kojoj je posjetitelj. [Consent Mode](consent-mode), odjeljak „Ništa prije privole”, objašnjava kad izabrati ovo, a kad je dovoljan sam Consent Mode.

## Podrška za 2.x

2.x dobiva samo sigurnosne zakrpe, do 30. travnja 2027.: bez novih mogućnosti i bez novih verzija Angulara. Sigurnosna zakrpa izlazi kao izdanje 2.x na npm-u pod `perpetuum-analytics`. Od 1. svibnja 2027. 2.x više ne dobiva izdanja; paket ostaje na npm-u, označen kao zastario, s uputom na ovaj vodič.
