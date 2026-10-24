# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

-   Development moved to Angular 22, Vitest and ESLint, with GitHub Actions checking every pull request.
-   The package now lists `@angular/platform-browser`, `@angular/router` and `rxjs` as peer dependencies and supports Angular 21 and 22.
-   README, licence and changelog ship with the package from one place.

## [2.0.20] - 2024-04-11

### Fixed

-   Page views wait for the page title, so it is no longer missing in some events (#40).

## [2.0.1 – 2.0.16] - 2022-04-19 to 2022-04-21

### Changed

-   Built with Angular 13 in partial (Ivy) compilation mode.

## [2.0.0] - 2022-04-19

### Changed

-   `setGoogleAnalyticsScripts()` no longer needs a `Renderer2`; the argument is accepted and ignored.

## [1.1.4] - 2019-02-24

### Fixed

-   Fixed alias based import that was causing error

```JS
ERROR in node_modules/perpetuum-analytics/lib/analytics.module.d.ts(2,34): error TS2307: Cannot find module '@projects/perpetuum-analytics/src/lib/models/Analytics-config.model'.
```

## [1.1.1 - 1-1-3]

Test builds

## [1.1.0] - 2019-02-10

### Added

-   PerpetuumAnalytics directive to enable easy way to send custom events
-   New interface IEventData

### Changed

-   Minor refactoring, list of input params in analytics service converted to object of type IEventData

## [1.0.2] - 2019-02-09

### Changed

-   Updated readme

## [1.0.1] - 2019-02-09

### Changed

-   Updated package.json file with missing properties required for npm registry

## [1.0.0] - 2019-02-09

### Added

-   Released initial stable version
