# &lt;perpetuum-analytics /&gt;

SSR-safe Google Analytics 4 and Google Tag Manager for Angular.

On the server it stays quiet: no `window`, no script, no data layer, so server-side rendering and hydration run as if analytics were not there. In the browser one provider loads the tag and sends a page view after every navigation.

Works with Angular 21 and 22: standalone or NgModule apps, with or without zone.js, with or without server-side rendering.

Full guide with how-to examples and a FAQ, in English and Croatian: [`docs/`](docs).

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

## Content Security Policy

With a nonce-based policy, the Google tag script carries Angular's `CSP_NONCE` (since 3.1). The usual way is `ngCspNonce` on the root element, written by the server with the same nonce as in the `Content-Security-Policy` header:

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

Version 3 is a new package name and a smaller API.

| 2.x                                                                                  | 3.x                                                                |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `npm i perpetuum-analytics`                                                          | `npm i @triliumhr/perpetuum-analytics`                             |
| `AnalyticsModule.forRoot({ trackingId, trackingType: 'gtag' })`                      | `provideAnalytics({ tag: 'gtag', measurementId })`                 |
| `trackingType: 'gtm'` with your own snippet                                          | `provideAnalytics({ tag: 'gtm', containerId })`, no snippet needed |
| `analytics.setGoogleAnalyticsScripts()` in `AppComponent`                            | nothing, the provider starts on its own                            |
| `analyticsService.sendEvent({ eventCategory, eventAction, eventLabel, eventValue })` | `analytics.event(name, params)`                                    |
| `[perpetuumAnalytics]="{ … }"`                                                       | `perpetuumTrack="name"` with `[perpetuumTrackParams]`              |
| `trackingType: 'analytics'` (analytics.js)                                           | not supported, Google retired Universal Analytics                  |

If you called `setGoogleAnalyticsScripts()` only after consent, either add the provider at that point (lazy route or `bootstrapApplication` after the choice) or use Consent Mode.

Version 2.x stays on npm under `perpetuum-analytics` and keeps working.

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

## Maintenance

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
