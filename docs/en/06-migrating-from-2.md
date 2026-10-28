---
title: Moving from 2.x
slug: migrating-from-2
order: 6
summary: What changed in 3.0, what was removed and how to move an app over in a few minutes.
---

# Moving from 2.x

Version 3 has a new package name, a smaller API and the MIT licence, and keeps everything 2.x could do for GA4 and Tag Manager. Version 2.x stays on npm as `perpetuum-analytics` and keeps working, so you can move when it suits you before its support ends (see [Support for 2.x](#support-for-2x)).

## Breaking changes

| 2.x                                                                 | 3.x                                                                              |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `npm i perpetuum-analytics`                                         | `npm i @triliumhr/perpetuum-analytics`                                           |
| `AnalyticsModule.forRoot({ trackingId, trackingType: 'gtag' })`     | `provideAnalytics({ tag: 'gtag', measurementId })`                               |
| `trackingType: 'gtm'` with your own snippet                         | `provideAnalytics({ tag: 'gtm', containerId })`, no snippet                      |
| `analytics.setGoogleAnalyticsScripts()` in `AppComponent`           | the provider starts on its own, or on `analytics.start()` with `start: 'manual'` |
| `setGoogleAnalyticsScripts()` called after consent                  | `start: 'manual'` and `analytics.start()`                                        |
| GTM data layer `pageview` and `GAEvent`                             | GA4 names, or the 2.x ones with `legacyEventNames: true`                         |
| `sendEvent({ eventCategory, eventAction, eventLabel, eventValue })` | `analytics.event(name, params)`                                                  |
| `[perpetuumAnalytics]="{ … }"`                                      | `perpetuumTrack="name"` with `[perpetuumTrackParams]`                            |
| `trackingType: 'analytics'` (analytics.js)                          | removed, Google retired Universal Analytics                                      |
| Angular 13 and newer                                                | Angular 21 and 22                                                                |
| GPL-3.0                                                             | MIT                                                                              |

## Step by step

1. Swap the package:

    ```bash
    npm uninstall perpetuum-analytics
    npm install @triliumhr/perpetuum-analytics
    ```

2. Replace `AnalyticsModule.forRoot(…)` with `provideAnalytics(…)` in the app providers. In an NgModule app it goes in the `providers` of the root module.
3. Remove the `setGoogleAnalyticsScripts()` call. If the app called it only after the visitor agreed, see [If you loaded the tag only after consent](#if-you-loaded-the-tag-only-after-consent).
4. Rewrite events. A 2.x event with category, action and label becomes a GA4 event named after the action:

    ```ts
    // 2.x
    this.analytics.sendEvent({ eventCategory: 'Cart', eventAction: 'add_to_cart', eventLabel: item.name, eventValue: item.price })
    // 3.x
    this.analytics.event('add_to_cart', { currency: 'EUR', value: item.price, items: [{ item_name: item.name }] })
    ```

5. Replace `[perpetuumAnalytics]` with `perpetuumTrack` and import `TrackEvent` where it is used.
6. Turn off the history page views in GA4, as in [Getting started](getting-started#one-setting-in-google-analytics).

## With Google Tag Manager: update the container

In 3.x the data layer speaks GA4. A container built for 2.x listens for other names, so choose one of two ways.

### Keep the container as it is

Add one option, and the data layer gets the 2.x names, so the container keeps counting without a change:

```ts
provideAnalytics({ tag: 'gtm', containerId: 'GTM-XXXXXXX', legacyEventNames: true })
```

Page views arrive as `{ event: 'pageview', page: { path, title } }` and events as `{ event: 'GAEvent', eventCategory, eventAction, eventLabel, eventValue }`. `analytics.event('add_to_cart', { event_category: 'Cart', event_label: item.name, value: item.price })` fills them: the name becomes `eventAction`, `event_category`, `event_label` and `value` the other three, and any other parameter stays next to them. This is the quickest move, and the container can switch to GA4 names later, in its own time.

### Move the container to GA4 names

Triggers and variables that listen to 2.x names need one update:

| 2.x data layer                                                             | 3.x data layer                                          |
| -------------------------------------------------------------------------- | ------------------------------------------------------- |
| `{ event: 'pageview', page: { path, title } }`                             | `{ event: 'page_view', page_location, page_title }`     |
| `{ event: 'GAEvent', eventCategory, eventAction, eventLabel, eventValue }` | `{ event: 'add_to_cart', …params }`, named by the event |

1. In the container, add triggers for the new names next to the old ones: the custom event `page_view`, and one custom event per event name you send.
2. Point the variables to `page_location` (the full address) and `page_title` instead of `page.path` and `page.title`.
3. Publish the container, then release the app with 3.x, then remove the old triggers. This way no page view is lost while the two meet.

## If you loaded the tag only after consent

In 2.x some apps called `setGoogleAnalyticsScripts()` only after the visitor agreed. In 3.x the same is `start: 'manual'`, with `analytics.start()` where the old call was:

```ts
provideAnalytics({ tag: 'gtag', measurementId: 'G-XXXXXXXXXX', start: 'manual' })

// when the visitor allows statistics
inject(Analytics).start()
```

Until then nothing loads from Google and events are not sent. After `start()` the tag loads once and counts the page the visitor is on. [Consent Mode](consent-mode#load-nothing-before-consent) explains when to choose this and when Consent Mode alone is enough.

## Support for 2.x

2.x gets security fixes only, until 30 April 2027: no new features and no new Angular versions. A security fix comes as a 2.x patch release on npm under `perpetuum-analytics`. From 1 May 2027, 2.x gets no more releases; the package stays on npm, marked as deprecated with a pointer to this guide.
