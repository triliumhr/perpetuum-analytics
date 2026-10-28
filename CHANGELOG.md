# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - Unreleased

Our best version so far: SSR-safe by design, Google Tag Manager without a snippet, Consent Mode, and every release proven by 100 % test coverage and an end-to-end test of a real SSR app. Everything 2.x did for GA4 and Tag Manager is still here, including a manual start and the 2.x data layer names. The package is now `@triliumhr/perpetuum-analytics`, under the MIT licence.

2.x (`perpetuum-analytics`) gets security fixes only, until 30 April 2027: no new features and no new Angular versions.

### Breaking changes

Step-by-step guide: [Moving from 2.x](docs/en/06-migrating-from-2.md).

-   New package name: `npm i @triliumhr/perpetuum-analytics` instead of `perpetuum-analytics`.
-   `AnalyticsModule.forRoot()` is replaced by `provideAnalytics({ tag: 'gtag', measurementId })` or `provideAnalytics({ tag: 'gtm', containerId })`.
-   `setGoogleAnalyticsScripts()` is gone: the provider starts on its own in the browser. Apps that called it only after consent use `start: 'manual'` and `analytics.start()`.
-   `AnalyticsService.sendEvent({ eventCategory, eventAction, eventLabel, eventValue })` is replaced by `Analytics.event(name, params)` with GA4 names and parameters.
-   The `[perpetuumAnalytics]` directive is replaced by `perpetuumTrack` with `[perpetuumTrackParams]`.
-   analytics.js (`trackingType: 'analytics'`) is no longer supported, since Google retired Universal Analytics.
-   Angular 21 or 22 is required; `@angular/router` and `rxjs` are peer dependencies.
-   With Google Tag Manager, remove the snippet from `index.html`; the package loads the container.
-   With Google Tag Manager, the data layer uses GA4 names: page views are `page_view` with `page_location` and `page_title` (was `pageview` with `page.path` and `page.title`), and events carry their own name instead of `GAEvent`. `legacyEventNames: true` keeps the 2.x names, so an existing container counts without changes; or update its triggers and variables, see [Moving from 2.x](docs/en/06-migrating-from-2.md#with-google-tag-manager-update-the-container).

### Added

-   `provideAnalytics()` for Google Analytics 4 and Google Tag Manager: the tag loads once when the app starts in the browser, with one page view per navigation.
-   Google Tag Manager loads the container itself and receives page views and events in its data layer.
-   `Analytics.event(name, params)` and the `perpetuumTrack` directive for custom events, also in apps without the router.
-   Consent Mode v2: `consentDefaults`, sent before any other command, and `Analytics.updateConsent()`.
-   `start: 'manual'` and `Analytics.start()`: nothing loads from Google until the app starts the tag, for example once the visitor agrees, as `setGoogleAnalyticsScripts()` allowed in 2.x. A late start counts the current page, and a consent choice made before it follows the defaults. ([#44](https://github.com/triliumhr/perpetuum-analytics/issues/44))
-   `legacyEventNames: true` for Google Tag Manager: page views as `pageview` with `page.path` and `page.title`, and events as `GAEvent` with `eventCategory`, `eventAction`, `eventLabel` and `eventValue`, as 2.x pushed them.
-   The Google tag script carries Angular's `CSP_NONCE` (or `ngCspNonce` on the root element), so a strict nonce-based Content Security Policy needs no Google host in `script-src`. Without a nonce nothing changes. ([#42](https://github.com/triliumhr/perpetuum-analytics/issues/42))
-   A security policy ([SECURITY.md](SECURITY.md)) and a public support policy: supported versions, Angular majors, the maintenance rhythm and deprecation notice ([Support and maintenance](docs/en/10-support.md)).
-   Support for NgModule apps and zoneless apps, each covered by specs.
-   Proof of SSR safety: a spec renders through `@angular/platform-server`, and an end-to-end test runs a demo app with Angular SSR in Chromium.
-   100 % line, branch, function and statement coverage as a gate on every pull request and release.
-   Releases from version tags only, published to npm with provenance.
-   Documentation with how-to examples and a FAQ, in English and Croatian.

### Changed

-   Page views carry the full address and the route's title as soon as the router sets it, without a fixed delay.
-   Licence MIT instead of GPL-3.0.

### Fixed

-   With Google Tag Manager, an event parameter named `event` can no longer turn one event into another.

### Removed

-   `AnalyticsModule`, `AnalyticsService`, the `perpetuumAnalytics` directive and the `I*` config types.

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
