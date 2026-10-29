<h1><img src="https://raw.githubusercontent.com/triliumhr/perpetuum-analytics/main/assets/logo.svg" alt="perpetuum-analytics" width="611" height="92"></h1>

SSR-safe Google Analytics 4 and Google Tag Manager for Angular.

On the server it stays quiet: no `window`, no script, no data layer, so server-side rendering and hydration run as if analytics were not there. In the browser one provider loads the tag and sends a page view after every navigation.

Consent comes first. With `start: 'manual'`, nothing reaches Google until your app calls `analytics.start()`, for example once the visitor agrees. With Consent Mode, the tag loads and follows the visitor's choice. See [Consent Mode](#consent-mode).

Works with Angular 21 and 22: standalone or NgModule apps, with or without zone.js, with or without server-side rendering.

Full guide with how-to examples and a FAQ, in English and Croatian: [`docs/`](docs).

## Formerly `perpetuum-analytics`

Version 3 continues [`perpetuum-analytics`](https://www.npmjs.com/package/perpetuum-analytics), the package published since 2020 as `nrozic/perpetuum-ng-analytics`. Same author, same purpose, now under the Trilium name and the MIT licence. Coming from 2.x? See [Moving from 2.x](#moving-from-2x).

## Installation

```bash
npm install @triliumhr/perpetuum-analytics
```

## Google Analytics 4

Add the provider with your measurement id (`G-…`):

```ts
// app.config.ts
import { provideAnalytics } from '@triliumhr/perpetuum-analytics'

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideAnalytics({ tag: 'gtag', measurementId: 'G-XXXXXXXXXX' })],
}
```

That is all. When the app starts in the browser, gtag.js loads once and every navigation sends one `page_view` with the full address and the route's title.

One setting in Google Analytics keeps each navigation counted once: in Admin › Data streams › your web stream › Enhanced measurement › Page views › Show advanced settings, untick **Page changes based on browser history events**. The package already sends those page views.

## Google Tag Manager

```ts
provideAnalytics({ tag: 'gtm', containerId: 'GTM-XXXXXXX' })
```

The container loads with the `gtm.js` event. Page views arrive in the data layer as `page_view` events, and custom events under their own names, ready for the tags you set up in the container.

A container built for 2.x keeps counting with `legacyEventNames: true`: the data layer then gets `pageview` and `GAEvent`, as 2.x pushed them. See [A container built for 2.x](docs/en/02-tag-manager.md#a-container-built-for-2x).

## Custom events

From a template, with the `perpetuumTrack` directive:

```html
<button type="button" perpetuumTrack="add_to_cart" [perpetuumTrackParams]="{ currency: 'EUR', value: item.price }">Add to cart</button>
```

```ts
import { TrackEvent } from '@triliumhr/perpetuum-analytics'

@Component({ imports: [TrackEvent] /* … */ })
```

From code:

```ts
inject(Analytics).event('sign_up', { method: 'email' })
```

Event names and parameters are the ones Google Analytics 4 uses (`add_to_cart`, `purchase`, `value`, `currency`, `items`…).

## Consent Mode

If your site uses Google Consent Mode, give the defaults in the config and pass on the visitor's choice when your cookie banner reports it:

```ts
provideAnalytics({
    tag: 'gtag',
    measurementId: 'G-XXXXXXXXXX',
    consentDefaults: { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' },
})

inject(Analytics).updateConsent({ analytics_storage: 'granted' })
```

The defaults reach Google before any other command. Without `consentDefaults`, nothing about consent is sent.

If your site may not contact Google at all before the visitor agrees, start the tag yourself:

```ts
provideAnalytics({ tag: 'gtag', measurementId: 'G-XXXXXXXXXX', start: 'manual' })

inject(Analytics).start() // when the visitor allows statistics
```

Until then nothing loads and nothing is sent; a choice passed to `updateConsent()` waits for the tag. See [Load nothing before consent](docs/en/04-consent-mode.md#load-nothing-before-consent).

## Content Security Policy

With a nonce-based policy, the Google tag script carries Angular's `CSP_NONCE`. The usual way is `ngCspNonce` on the root element, written by the server with the same nonce as in the `Content-Security-Policy` header:

```html
<app-root ngCspNonce="…"></app-root>
```

`script-src` then needs no Google host. See [Strict Content Security Policy](docs/en/01-getting-started.md#strict-content-security-policy).

## Server-side rendering

This is why the package exists. On the server the provider does nothing: it never reads `window` or `document.defaultView`, adds no script and sends no events, so the rendered HTML is the same with or without analytics. Everything starts once the app runs in the browser, and the first navigation there sends the first page view.

## How it is tested

Every pull request and every release runs the same checks, and a release is published only from a version tag after they pass:

| Check                                        | What it proves                                                                                                                                                                     |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vitest specs with 100 % coverage             | every line and branch of the package runs in a spec; the build fails below 100 %                                                                                                   |
| Rendering through `@angular/platform-server` | the server HTML has no Google script and no data layer                                                                                                                             |
| End-to-end in Chromium                       | a demo app with Angular SSR on Express: complete server HTML, hydration, one script load, one page view per navigation, events, consent, a strict nonce-based CSP, a clean console |
| Angular 21 and 22                            | the specs run on both supported versions                                                                                                                                           |
| NgModule and zoneless apps                   | both setups have their own specs                                                                                                                                                   |
| Lint, format, `publint`                      | code and package follow the rules                                                                                                                                                  |

No test talks to Google: every request to Google is answered locally. Each behaviour starts as a failing spec committed before the code, so the history shows the order. npm publishes with provenance, which ties the package to the exact commit and workflow run.

## Moving from 2.x

Version 3 is a new package name and a smaller API, and it keeps everything 2.x did for GA4 and Tag Manager.

| 2.x                                                                                  | 3.x                                                                              |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `npm i perpetuum-analytics`                                                          | `npm i @triliumhr/perpetuum-analytics`                                           |
| `AnalyticsModule.forRoot({ trackingId, trackingType: 'gtag' })`                      | `provideAnalytics({ tag: 'gtag', measurementId })`                               |
| `trackingType: 'gtm'` with your own snippet                                          | `provideAnalytics({ tag: 'gtm', containerId })`, no snippet needed               |
| `analytics.setGoogleAnalyticsScripts()` in `AppComponent`                            | the provider starts on its own, or on `analytics.start()` with `start: 'manual'` |
| `analyticsService.sendEvent({ eventCategory, eventAction, eventLabel, eventValue })` | `analytics.event(name, params)`                                                  |
| `[perpetuumAnalytics]="{ … }"`                                                       | `perpetuumTrack="name"` with `[perpetuumTrackParams]`                            |
| `trackingType: 'analytics'` (analytics.js)                                           | not supported, Google retired Universal Analytics                                |
| `setGoogleAnalyticsScripts()` called after consent                                   | `start: 'manual'` and `analytics.start()`                                        |
| GTM data layer `pageview` and `GAEvent`                                              | GA4 names, or the 2.x ones with `legacyEventNames: true`                         |

Step by step, Tag Manager containers included: [Moving from 2.x](docs/en/06-migrating-from-2.md).

Version 2.x stays on npm under `perpetuum-analytics` and keeps working. It gets security fixes only, until 30 April 2027: no new features and no new Angular versions. See [SECURITY.md](SECURITY.md).

## Development

An Angular CLI workspace with the library in `projects/perpetuum-analytics`. You need Node.js 22.22.3 or 24.15 and newer.

```bash
npm ci
npm test            # Vitest specs with 100 % coverage
npm run lint        # ESLint with angular-eslint
npm run build       # the package in dist/perpetuum-analytics
npm run pack:check  # build, npm pack --dry-run and publint
npm run build:demo && npm run e2e  # SSR demo app, end-to-end in Chromium
```

GitHub Actions runs the same checks on every pull request, the specs also on Angular 21, and the end-to-end test on the SSR demo.

### Releasing

1. Add the version to `CHANGELOG.md`.
2. `npm version <major|minor|patch> --no-git-tag-version` in `projects/perpetuum-analytics`, commit, then `git tag v<version>` and push the tag.
3. The Release workflow checks everything again and publishes to npm through Trusted Publishing, with provenance.

## Support and maintenance

| Version                               | Support                                        |
| ------------------------------------- | ---------------------------------------------- |
| 3.x, `@triliumhr/perpetuum-analytics` | active: new features, fixes and security fixes |
| 2.x, `perpetuum-analytics`            | security fixes only, until 30 April 2027       |

The two newest Angular majors are supported, a new one within 30 days of its stable release, and nothing is removed without at least 6 months' notice and a new major. The whole policy: [Support and maintenance](docs/en/10-support.md).

- **Every week:** Dependabot groups dependency updates, CI runs all checks on `main` against the latest releases, and open security alerts and `npm audit` are reviewed.
- **Every month:** new Angular, TypeScript and Node.js releases and GitHub Actions versions are checked against the support policy, and open issues and pull requests are answered.
- **Every quarter:** a security review of the code, the release workflow and npm publishing, and a review of the roadmap.

Every change from maintenance comes as a pull request with the same checks as any other.

## Roadmap

What comes next and how Angular versions are supported: [ROADMAP.md](ROADMAP.md).

## Questions and ideas

Open an [issue](https://github.com/triliumhr/perpetuum-analytics/issues) and describe what you would like the package to do.

## Licence

[MIT](LICENSE.md) from 3.0.0. Versions up to 2.0.20 were published under GPL-3.0.

Made by [Trilium](https://trilium.io).
