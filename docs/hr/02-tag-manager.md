---
title: Google Tag Manager
slug: tag-manager
order: 2
summary: Učitaj Tag Manager spremnik i primaj prikaze stranica i evente u njegovom data layeru.
---

# Google Tag Manager

Kad su tagovi u Tag Manager spremniku, umjesto ID-ja mjerenja daj ID spremnika:

```ts
provideAnalytics({ tag: 'gtm', containerId: 'GTM-XXXXXXX' })
```

Paket sam učita spremnik, pa Tag Manager isječak u `index.html` više ne treba. Ako je ondje, makni ga, inače se spremnik učita dvaput.

## Što stiže u data layer

| Kada                                              | Unos u data layeru                                  |
| ------------------------------------------------- | --------------------------------------------------- |
| Aplikacija se pokrene u pregledniku               | `{ event: 'gtm.js', 'gtm.start': … }`               |
| Svaka navigacija                                  | `{ event: 'page_view', page_location, page_title }` |
| `analytics.event('add_to_cart', { value: 12.5 })` | `{ event: 'add_to_cart', value: 12.5 }`             |

## Postavi spremnik

1. **Varijable:** dodaj dvije Data Layer Variable, `page_location` i `page_title`.
2. **Okidač:** Custom Event s imenom eventa `page_view`.
3. **Tag:** Google Analytics: GA4 Event s imenom eventa `page_view`, dvije varijable kao parametri eventa i okidač iz koraka 2.
4. U Google tagu spremnika postavi `send_page_view` na `false`, da se prva stranica ne broji dvaput.

Vlastiti eventi rade isto: Custom Event okidač s imenom eventa i GA4 Event tag koji čita njegove parametre.

## Spremnik složen za 2.x

Uz `legacyEventNames: true` data layer dobiva imena koja je slao 2.x, pa takav spremnik broji i dalje, bez izmjene:

```ts
provideAnalytics({ tag: 'gtm', containerId: 'GTM-XXXXXXX', legacyEventNames: true })
```

| Kada                                                                      | Unos u data layeru                                                                          |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Svaka navigacija                                                          | `{ event: 'pageview', page: { path, title } }`                                              |
| `analytics.event('add_to_cart', { event_category: 'Cart', value: 12.5 })` | `{ event: 'GAEvent', eventCategory: 'Cart', eventAction: 'add_to_cart', eventValue: 12.5 }` |

`page.path` je adresa unutar aplikacije, kao u 2.x. Vidi [Prijelaz s 2.x](migracija), odjeljak „Uz Google Tag Manager: osvježi kontejner”.
