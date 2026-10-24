---
title: How it is tested
slug: testing
order: 7
summary: Every release passes unit specs with full coverage, a real SSR render and an end-to-end run in Chromium.
---

# How it is tested

A release is published only from a version tag, after the same checks that run on every pull request.

## On every pull request

| Check                                         | What it proves                                                                                                                                            |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Specs (Vitest) with 100 % coverage            | every line and branch of the library runs in a spec; the build fails below 100 %                                                                          |
| Server render with `@angular/platform-server` | the server HTML has no Google script and no data layer                                                                                                    |
| End-to-end in Chromium                        | a demo app with Angular SSR on Express: complete server HTML, hydration, one script load, one page view per navigation, events, consent, an empty console |
| Angular 21 and 22                             | the specs run on both supported majors                                                                                                                    |
| NgModule and zoneless apps                    | both setups are covered by specs                                                                                                                          |
| Lint, format, `publint`                       | the code and the package follow the rules                                                                                                                 |

Requests to Google are answered locally in every test, so no test depends on Google or sends anything to it.

## How specs are written

Each behaviour starts as a failing spec, committed before the code that makes it pass. The history of the repository shows that order for every feature.

## Releases

A tag such as `v3.0.0` starts the release workflow: the checks run again, the tag must match the package version, and npm publishes the package with a provenance statement that links it to the exact commit and workflow run. The npm page shows that statement.
