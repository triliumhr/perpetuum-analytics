---
title: Moving from 2.x
slug: migrating-from-2
order: 6
summary: What changed in 3.0, what was removed and how to move an app over in a few minutes.
---

# Moving from 2.x

Version 3 has a new package name, a smaller API and the MIT licence. Version 2.x stays on npm as `perpetuum-analytics` and keeps working, so you can move when it suits you.

## Breaking changes

| 2.x                                                                 | 3.x                                                         |
| ------------------------------------------------------------------- | ----------------------------------------------------------- |
| `npm i perpetuum-analytics`                                         | `npm i @triliumhr/perpetuum-analytics`                      |
| `AnalyticsModule.forRoot({ trackingId, trackingType: 'gtag' })`     | `provideAnalytics({ tag: 'gtag', measurementId })`          |
| `trackingType: 'gtm'` with your own snippet                         | `provideAnalytics({ tag: 'gtm', containerId })`, no snippet |
| `analytics.setGoogleAnalyticsScripts()` in `AppComponent`           | nothing, the provider starts on its own                     |
| `sendEvent({ eventCategory, eventAction, eventLabel, eventValue })` | `analytics.event(name, params)`                             |
| `[perpetuumAnalytics]="{ … }"`                                      | `perpetuumTrack="name"` with `[perpetuumTrackParams]`       |
| `trackingType: 'analytics'` (analytics.js)                          | removed, Google retired Universal Analytics                 |
| Angular 13 and newer                                                | Angular 21 and 22                                           |
| GPL-3.0                                                             | MIT                                                         |

## Step by step

1. Swap the package:

    ```bash
    npm uninstall perpetuum-analytics
    npm install @triliumhr/perpetuum-analytics
    ```

2. Replace `AnalyticsModule.forRoot(…)` with `provideAnalytics(…)` in the app providers. In an NgModule app it goes in the `providers` of the root module.
3. Remove the `setGoogleAnalyticsScripts()` call.
4. Rewrite events. A 2.x event with category, action and label becomes a GA4 event named after the action:

    ```ts
    // 2.x
    this.analytics.sendEvent({ eventCategory: 'Cart', eventAction: 'add_to_cart', eventLabel: item.name, eventValue: item.price })
    // 3.x
    this.analytics.event('add_to_cart', { currency: 'EUR', value: item.price, items: [{ item_name: item.name }] })
    ```

5. Replace `[perpetuumAnalytics]` with `perpetuumTrack` and import `TrackEvent` where it is used.
6. Turn off the history page views in GA4, as in [Getting started](getting-started#one-setting-in-google-analytics).

## If you loaded the tag only after consent

In 2.x some apps called `setGoogleAnalyticsScripts()` only after the visitor agreed. In 3.x use [Consent Mode](consent-mode): the tag loads with everything `denied` and follows the choice.
