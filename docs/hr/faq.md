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

Googleu može trebati sat ili više da promjenu primijeni na tag koji poslužuje, pa drugi prikaz stranice može još neko vrijeme stizati i nakon spremanja. Razlikuješ ih na kartici Network: prikaz stranice iz paketa nosi `_ee=1`, a onaj iz promjena povijesti stiže nekoliko sekundi kasnije, bez toga.

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

Uz pravila s nonceom daj Angularu nonce stranice (`ngCspNonce` na korijenskom elementu ili `CSP_NONCE`), i skripta Google taga ga nosi, pa `script-src` ne treba nijedan Googleov host. Vidi [Strogi Content Security Policy](pocetak#strogi-content-security-policy). Uz pravila po hostovima dopusti `https://www.googletagmanager.com` u `script-src`. U oba slučaja dopusti hostove Google Analyticsa u `connect-src` i `img-src`.

### Koristim 2.x. Moram li prijeći?

Ne odmah: 2.x i dalje radi i dobiva sigurnosne zakrpe do 30. travnja 2027., bez novih mogućnosti i bez novih verzija Angulara. Verzija 3 zadržava sve što je 2.x radio i donosi Tag Manager bez isječka, Consent Mode, sigurnost uz SSR i MIT licencu. Vidi [Prijelaz s 2.x](migracija).
