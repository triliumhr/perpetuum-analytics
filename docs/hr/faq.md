---
title: Česta pitanja
slug: cesta-pitanja
order: 9
summary: Kratki odgovori na pitanja koja se najčešće postavljaju.
---

# Česta pitanja

### Radi li uz renderiranje na serveru?

Da, zbog toga je i nastao. Na serveru ne radi ništa, a u pregledniku kreće nakon hidracije. Vidi [Renderiranje na serveru](ssr).

### Zašto svaki prikaz stranice vidim dvaput?

Google Analytics i sam broji promjene povijesti preglednika. U postavkama Enhanced measurement web streama isključi **Page changes based on browser history events**, kao u [Početku](pocetak#jedna-postavka-u-google-analyticsu). Uz Tag Manager provjeri i da je isječak iz `index.html` maknut.

### Radi li s NgModulima?

Da. Stavi `provideAnalytics()` u `providers` glavnog modula, a `TrackEvent` u `imports` modula koji koristi direktivu.

### Radi li bez zone.js?

Da. Paket ne koristi nijedan zone.js API, a test ga pokreće u aplikaciji bez zone.js.

### Treba li mi router?

Za automatske prikaze stranica da, jer prate navigacije routera. Vlastiti eventi rade i bez njega.

### Kako vidim evente dok razvijam?

Instaliraj Google Analytics Debugger u Chromeu ili uz Tag Manager otvori spremnik u načinu Preview (Tag Assistant). Eventi se tada vide u Google Analytics › Admin › DebugView.

### Šalje li se Googleu i upit iz adrese?

Da, `page_location` je cijela adresa, kao i kod Googleova taga. Ako adrese mogu sadržavati osobne podatke, npr. e-mail u parametru upita, drži ih izvan adrese ili ih ukloni u postavkama Google taga.

### Postavlja li kolačiće?

Paket sam ne postavlja nijedan. GA4 kolačiće postavlja Google tag, osim kad Consent Mode kaže `analytics_storage: 'denied'`.

### Mogu li ga koristiti s vlastitim cookie bannerom?

Da. Prenesi izbor u `updateConsent()`; radi svaki banner ili alat za privolu koji javlja izbor posjetitelja. Vidi [Consent Mode](consent-mode).

### Što s Content Security Policyjem?

Dopusti `https://www.googletagmanager.com` u `script-src`, a hostove Google Analyticsa u `connect-src` i `img-src`, kako Google opisuje za svoj tag.

### Koristim 2.x. Moram li prijeći?

Ne, 2.x i dalje radi. Verzija 3 donosi Tag Manager bez isječka, Consent Mode i MIT licencu. Vidi [Prijelaz s 2.x](migracija).
