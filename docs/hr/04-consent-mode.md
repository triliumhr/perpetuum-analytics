---
title: Consent Mode
slug: consent-mode
order: 4
summary: Prenesi Googleu izbor posjetitelja o kolačićima kroz Consent Mode v2.
---

# Consent Mode

Google Consent Mode kaže Google tagu što smije spremati. Ima četiri signala, svaki je `granted` ili `denied`:

| Signal               | Što dopušta                                        |
| -------------------- | -------------------------------------------------- |
| `analytics_storage`  | kolačiće za statistiku                             |
| `ad_storage`         | kolačiće za oglašavanje                            |
| `ad_user_data`       | slanje podataka o korisniku Googleu za oglašavanje |
| `ad_personalization` | personalizirane oglase                             |

Perpetuum Analytics te signale prenosi. Pitanje posjetitelju i pamćenje izbora ostaju tvom cookie banneru ili alatu za privolu.

## Zadano stanje

Navedi stanje koje vrijedi dok posjetitelj ne izabere:

```ts
provideAnalytics({
    tag: 'gtag',
    measurementId: 'G-XXXXXXXXXX',
    consentDefaults: { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' },
})
```

Zadano stanje stiže u data layer prije svake druge naredbe, kako Consent Mode i traži. Bez `consentDefaults` paket o privoli ne šalje ništa.

## Izbor posjetitelja

Kad banner javi izbor, prenesi ga:

```ts
inject(Analytics).updateConsent({ analytics_storage: 'granted' })
```

Pozovi ga svaki put kad se izbor promijeni i pri svakom učitavanju stranice s izborom koji banner pamti.

## Tag Manager

Uz `tag: 'gtm'` iste naredbe idu u data layer spremnika, pa ih tagovi u spremniku koji podržavaju Consent Mode slijede.

## Ništa prije privole

Uz Consent Mode tag se učita odmah i ništa ne sprema dok posjetitelj ne pristane; uz `analytics_storage: 'denied'` Google i dalje prima signale bez kolačića. Ako tvoj web prije izbora uopće ne smije kontaktirati Google, pokreni tag sam:

```ts
provideAnalytics({ tag: 'gtag', measurementId: 'G-XXXXXXXXXX', start: 'manual' })

// kad posjetitelj dopusti statistiku
inject(Analytics).start()
```

| Prije `start()`                              | Nakon `start()`                                                        |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| nijedna skripta od Googlea, nema data layera | tag se učita jednom                                                    |
| `analytics.event()` ne šalje ništa           | broji se stranica na kojoj je posjetitelj, zatim svaka navigacija      |
| `updateConsent()` pamti izbor                | zapamćeni izbor ide odmah iza zadanog stanja, dalje sve radi kao inače |

Ponovni `start()` ne radi ništa, pa ga smiješ zvati pri svakom učitavanju stranice s izborom koji banner pamti. Ni na serveru ne radi ništa.

Što izabrati: Consent Mode zadržava Googleovo modeliranje posjetitelja koji su odbili, pa izvještaji pokazuju više. `start: 'manual'` je stroži: prije izbora ništa ne stiže Googleu, a posjetitelj koji odbije nikad se ne broji. Ta se dva spajaju: uz `consentDefaults` i `start: 'manual'` zadano stanje ide prvo, čim se tag pokrene.
