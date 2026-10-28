---
title: Kako testiramo
slug: kako-testiramo
order: 7
summary: Svako izdanje prolazi testove sa 100 % pokrivenosti, pravo renderiranje na serveru i end-to-end test u Chromiumu.
---

# Kako testiramo

Izdanje se objavljuje samo iz oznake verzije, nakon istih provjera koje prolazi svaki pull request.

## Na svakom pull requestu

| Provjera                                     | Što dokazuje                                                                                                                                                                                                                                      |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Testovi (Vitest) sa 100 % pokrivenosti       | svaki redak i svaka grana koda paketa prolazi kroz test; build pada ispod 100 %                                                                                                                                                                   |
| Renderiranje kroz `@angular/platform-server` | HTML sa servera nema Google skriptu ni data layer                                                                                                                                                                                                 |
| End-to-end u Chromiumu                       | demo aplikacija s Angular SSR-om na Expressu: potpun HTML sa servera, hidracija, jedno učitavanje skripte, jedan prikaz stranice po navigaciji, eventi, privola, ništa Googleu prije privole uz ručni start, strogi CSP s nonceom, prazna konzola |
| Angular 21 i 22                              | testovi se vrte na obje podržane verzije                                                                                                                                                                                                          |
| Aplikacije s NgModulima i bez zone.js        | oba načina pokrivaju testovi                                                                                                                                                                                                                      |
| Lint, format, `publint`                      | kod i paket slijede pravila                                                                                                                                                                                                                       |

Svaki test zahtjeve prema Googleu odgovara lokalno, pa nijedan test ne ovisi o Googleu niti mu išta šalje.

## Kako nastaju testovi

Svako ponašanje počinje kao test koji pada, spremljen prije koda koji ga ispunjava. Povijest repozitorija pokazuje taj redoslijed za svaku mogućnost.

## Izdanja

Oznaka poput `v3.0.0` pokreće objavu: provjere se ponove, oznaka mora odgovarati verziji paketa, a npm objavi paket s potvrdom porijekla (provenance), koja ga veže uz točan commit i pokretanje. Potvrda se vidi na stranici paketa na npm-u.
