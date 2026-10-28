---
title: Consent Mode
slug: consent-mode
order: 4
summary: Pass the visitor's cookie choice to Google with Consent Mode v2.
---

# Consent Mode

Google Consent Mode tells the Google tag what it may store. It has four signals, each `granted` or `denied`:

| Signal               | What it allows                              |
| -------------------- | ------------------------------------------- |
| `analytics_storage`  | cookies for statistics                      |
| `ad_storage`         | cookies for advertising                     |
| `ad_user_data`       | sending user data to Google for advertising |
| `ad_personalization` | personalised advertising                    |

Perpetuum Analytics passes these signals on. Asking the visitor and remembering the choice stays with your cookie banner or consent tool.

## Defaults

Give the state that applies until the visitor chooses:

```ts
provideAnalytics({
    tag: 'gtag',
    measurementId: 'G-XXXXXXXXXX',
    consentDefaults: { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' },
})
```

The defaults reach the data layer before any other command, which is what Consent Mode requires. Without `consentDefaults` the package sends nothing about consent.

## The visitor's choice

When your banner reports a choice, pass it on:

```ts
inject(Analytics).updateConsent({ analytics_storage: 'granted' })
```

Call it again whenever the choice changes, and on every page load with the choice your banner remembers.

## Tag Manager

With `tag: 'gtm'` the same commands go to the container's data layer, so tags in the container that support Consent Mode follow them.

## Load nothing before consent

With Consent Mode the tag loads at once and stores nothing until the visitor agrees; with `analytics_storage: 'denied'` Google still receives cookieless pings. If your site may not contact Google at all before the choice, start the tag yourself:

```ts
provideAnalytics({ tag: 'gtag', measurementId: 'G-XXXXXXXXXX', start: 'manual' })

// when the visitor allows statistics
inject(Analytics).start()
```

| Before `start()`                     | After `start()`                                               |
| ------------------------------------ | ------------------------------------------------------------- |
| no script from Google, no data layer | the tag loads once                                            |
| `analytics.event()` sends nothing    | the page the visitor is on is counted, then every navigation  |
| `updateConsent()` keeps the choice   | the kept choice follows the defaults, then all works as usual |

Calling `start()` again does nothing, so it is safe to call on every page load with the choice your banner remembers. On the server it does nothing either.

Which to choose: Consent Mode keeps Google's modelling of visitors who declined, so reports show more. `start: 'manual'` is stricter: nothing reaches Google before the choice, and a visitor who declines is never counted. The two combine: with `consentDefaults` and `start: 'manual'`, the defaults go first once the tag starts.
