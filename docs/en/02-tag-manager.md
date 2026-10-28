---
title: Google Tag Manager
slug: tag-manager
order: 2
summary: Load a Tag Manager container and receive page views and events in its data layer.
---

# Google Tag Manager

When the tags live in a Tag Manager container, give the container id instead of a measurement id:

```ts
provideAnalytics({ tag: 'gtm', containerId: 'GTM-XXXXXXX' })
```

The package loads the container itself, so the Tag Manager snippet is not needed in `index.html`. Remove it if it is there, or the container loads twice.

## What arrives in the data layer

| When                                              | Data layer entry                                    |
| ------------------------------------------------- | --------------------------------------------------- |
| The app starts in the browser                     | `{ event: 'gtm.js', 'gtm.start': … }`               |
| Every navigation                                  | `{ event: 'page_view', page_location, page_title }` |
| `analytics.event('add_to_cart', { value: 12.5 })` | `{ event: 'add_to_cart', value: 12.5 }`             |

## Set up the container

1. **Variables:** add two Data Layer Variables, `page_location` and `page_title`.
2. **Trigger:** a Custom Event trigger with the event name `page_view`.
3. **Tag:** a Google Analytics: GA4 Event tag with the event name `page_view`, the two variables as event parameters, and the trigger from step 2.
4. In the Google tag of the container, set `send_page_view` to `false`, so the first page is not counted twice.

Custom events work the same way: a Custom Event trigger with the event name, and a GA4 Event tag that reads its parameters.

## A container built for 2.x

With `legacyEventNames: true` the data layer gets the names 2.x pushed, so such a container keeps counting without a change:

```ts
provideAnalytics({ tag: 'gtm', containerId: 'GTM-XXXXXXX', legacyEventNames: true })
```

| When                                                                      | Data layer entry                                                                            |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Every navigation                                                          | `{ event: 'pageview', page: { path, title } }`                                              |
| `analytics.event('add_to_cart', { event_category: 'Cart', value: 12.5 })` | `{ event: 'GAEvent', eventCategory: 'Cart', eventAction: 'add_to_cart', eventValue: 12.5 }` |

`page.path` is the address inside the app, as in 2.x. See [Moving from 2.x](migrating-from-2#with-google-tag-manager-update-the-container).
