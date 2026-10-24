---
title: Renderiranje na serveru (SSR)
slug: ssr
order: 5
summary: Zašto paket na serveru miruje i kako se to testira.
---

# Renderiranje na serveru (SSR)

Perpetuum Analytics je nastao za aplikacije koje se renderiraju na serveru. Kod za analitiku koji tijekom renderiranja poseže za `window` ili dodaje skripte ruši renderiranje na serveru ili hidraciju koja slijedi. Ovaj paket čeka preglednik.

## Na serveru

- Nikad ne čita `window` ni `document.defaultView`.
- Ne dodaje skriptu i ne stvara data layer.
- Ne šalje evente, pa je HTML isti s analitikom i bez nje.

## U pregledniku

1. Angular hidrira HTML sa servera.
2. Provider jednom učita Google tag.
3. Prva navigacija pošalje prvi prikaz stranice, s naslovom rute.

## Kako to znamo

- Test renderira stranicu s rutom kroz `renderApplication()` iz `@angular/platform-server` i provjerava da u HTML-u nema Google skripte ni data layera.
- End-to-end test složi demo aplikaciju s Angular SSR-om na Expressu, otvori je u Chromiumu i provjeri HTML sa servera, hidraciju, jedno učitavanje skripte, prikaze stranica, evente i praznu konzolu.

Oba se pokreću na svakom pull requestu. Vidi [Kako testiramo](kako-testiramo).

## Prerenderiranje

Prerenderirane stranice (`RenderMode.Prerender` ili SSG) također nastaju na serveru, pa ni u njima nema Googlea u HTML-u.
