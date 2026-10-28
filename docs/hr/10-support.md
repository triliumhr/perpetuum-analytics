---
title: Podrška i održavanje
slug: podrska
order: 10
summary: Koje su verzije podržane, kako pratimo izdanja Angulara i kako se paket održava.
---

# Podrška i održavanje

Perpetuum Analytics održavamo dugoročno. Ova stranica kaže na što možeš računati, pa svoje nadogradnje možeš planirati.

## Podržane verzije

| Verzija                               | Podrška                                                |
| ------------------------------------- | ------------------------------------------------------ |
| 3.x, `@triliumhr/perpetuum-analytics` | aktivna: nove mogućnosti, ispravci i sigurnosne zakrpe |
| 2.x, `perpetuum-analytics`            | samo sigurnosne zakrpe, do 30. travnja 2027.           |
| starije od 2.0                        | nisu podržane                                          |

2.x ne dobiva nove mogućnosti ni nove verzije Angulara. [Vodič za prijelaz](migracija) pokazuje kako prijeći na 3.x, a 3.x zadržava sve što je 2.x radio za GA4 i Tag Manager.

## Verzije Angulara

- **Podržane su dvije najnovije glavne verzije Angulara, sad 21 i 22.** Svaki test se izvodi na obje, na svakom pull requestu.
- **Nova glavna verzija Angulara dobiva podršku u roku od 30 dana od stabilnog izdanja,** u minor izdanju paketa.
- **Starija glavna verzija Angulara uklanja se samo u novoj glavnoj verziji paketa,** najavljeno u changelogu i planu razvoja kad stigne nova verzija Angulara, i najmanje 6 mjeseci prije uklanjanja. Do tada mogu biti podržane i tri glavne verzije odjednom.

## Ritam održavanja

- **Svaki tjedan:** nadogradnje ovisnosti, sve provjere na `main` uz najnovija izdanja, sigurnosna upozorenja i `npm audit`.
- **Svaki mjesec:** nova izdanja Angulara, TypeScripta i Node.js-a provjeravaju se prema ovoj politici, a otvoreni issuei i pull requestovi dobivaju odgovor.
- **Svaki kvartal:** sigurnosni pregled koda, postupka izdanja i objave na npm-u te pregled [plana razvoja](plan-razvoja).

Svaka promjena, i ona iz održavanja, dolazi kao pull request s istim provjerama: 100 % pokrivenosti, pravi SSR render i end-to-end test u Chromiumu. Vidi [Kako testiramo](kako-testiramo).

## Verzije i zastarijevanje

- Paket slijedi [semantičko verzioniranje](https://semver.org/lang/hr/): patch ispravlja, minor dodaje, a samo major traži izmjenu tvog koda. Svaka glavna verzija dolazi s vodičem za prijelaz.
- Prije uklanjanja nešto se najprije označi kao zastarjelo: u changelogu, dokumentaciji i tipovima, pa ga tvoj editor pokaže. Radi još najmanje 6 mjeseci i uklanja se tek u sljedećoj glavnoj verziji.
- Sigurnosne zakrpe imaju prednost i izlaze kao patch izdanje svake podržane verzije.

Sigurnosne propuste prijavi privatno, kako opisuje [SECURITY.md](https://github.com/triliumhr/perpetuum-analytics/blob/main/SECURITY.md).
