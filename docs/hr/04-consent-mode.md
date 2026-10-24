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
