# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - Unreleased

The package is now `@triliumhr/perpetuum-analytics`, under the MIT licence. See “Moving from 2.x” in the README.

### Added

-   `provideAnalytics()` for Google Analytics 4 (`tag: 'gtag'`) and Google Tag Manager (`tag: 'gtm'`): the tag loads on its own when the app starts in the browser, with one page view per navigation.
-   Google Tag Manager loads the container itself; no snippet in `index.html` is needed.
-   `Analytics.event(name, params)` and the `perpetuumTrack` directive for custom events with GA4 names and parameters.
-   Consent Mode as an option: `consentDefaults` and `Analytics.updateConsent()`.
-   Specs, linting and builds on every pull request, on Angular 21 and 22.

### Changed

-   Page views carry the full address and the route's title as soon as the router sets it, without a fixed delay.
-   Supports Angular 21 and 22; `@angular/router` and `rxjs` are peer dependencies.
-   Licence MIT instead of GPL-3.0.

### Removed

-   `AnalyticsModule`, `AnalyticsService`, the `perpetuumAnalytics` directive and the `I*` config types.
-   analytics.js (`trackingType: 'analytics'`), since Google retired Universal Analytics.

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
