---
title: Server-side rendering
slug: server-side-rendering
order: 5
summary: Why the package stays quiet on the server and how that is tested.
---

# Server-side rendering

Perpetuum Analytics was built for apps with server-side rendering. Analytics code that reaches for `window` or adds scripts during rendering breaks the server render or the hydration that follows. This package waits for the browser.

## On the server

- It never reads `window` or `document.defaultView`.
- It adds no script and creates no data layer.
- It sends no event, so the HTML is the same with or without analytics.

## In the browser

1. Angular hydrates the server HTML.
2. The provider loads the Google tag once.
3. The first navigation sends the first page view, with the title of the route.

## How we know

- A spec renders a routed page with `renderApplication()` from `@angular/platform-server` and checks that the HTML has no Google script and no data layer.
- An end-to-end run builds a demo app with Angular SSR on Express, opens it in Chromium and checks the server HTML, hydration, one script load, page views, events and an empty console.

Both run on every pull request. See [How it is tested](testing).

## Prerendering

Prerendered pages (`RenderMode.Prerender` or SSG) are rendered on the server too, so they also leave Google out of the HTML.
