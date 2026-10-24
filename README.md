# &lt;perpetuum-analytics /&gt;

Google Analytics 4 and Google Tag Manager for Angular. One provider loads the tag in the browser, sends a page view after every navigation and stays quiet on the server.

Works with Angular 21 and 22, standalone and with server-side rendering.

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

## Server-side rendering

On the server the provider does nothing: no script, no data layer, no events. Everything starts after the app boots in the browser.

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
npm test            # Vitest specs
npm run lint        # ESLint with angular-eslint
npm run build       # the package in dist/perpetuum-analytics
npm run pack:check  # build, npm pack --dry-run and publint
```

GitHub Actions runs the same checks on every pull request, and the specs also run on Angular 21.

## Questions and ideas

Open an [issue](https://github.com/triliumhr/perpetuum-analytics/issues) and describe what you would like the package to do.

## Licence

[MIT](LICENSE.md) from 3.0.0. Versions up to 2.0.20 were published under GPL-3.0.

Made by [Trilium](https://trilium.io).
