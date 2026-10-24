---
title: Getting started
slug: getting-started
order: 1
summary: Install the package, add one provider and see the first page view in Google Analytics 4.
---

# Getting started

Perpetuum Analytics connects an Angular app to Google Analytics 4 or Google Tag Manager. It is safe with server-side rendering: on the server it does nothing, in the browser it loads the tag and sends a page view after every navigation.

## Requirements

- Angular 21 or 22, standalone or with NgModules
- the Angular router, for automatic page views
- a GA4 measurement id (`G-…`) or a Tag Manager container id (`GTM-…`)

## Install

```bash
npm install @triliumhr/perpetuum-analytics
```

## Add the provider

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideAnalytics } from '@triliumhr/perpetuum-analytics'

import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideAnalytics({ tag: 'gtag', measurementId: 'G-XXXXXXXXXX' })],
}
```

That is the whole setup. There is nothing to add to `index.html` and nothing to call from a component.

## One setting in Google Analytics

The package sends a page view for every navigation itself, with the title of the new route. Google Analytics can also count history changes on its own, which would count each navigation twice. Turn that off once:

1. Google Analytics › Admin › Data streams › your web stream
2. Enhanced measurement › the gear icon
3. Page views › Show advanced settings › untick **Page changes based on browser history events** › Save

## See it working

Open the app, then Google Analytics › Reports › Realtime. Every navigation shows as a `page_view` with the page title. For a closer look, use [DebugView](faq#how-do-i-see-events-while-developing).

## Next

- [Custom events](events) such as `add_to_cart` and `sign_up`
- [Google Tag Manager](tag-manager) instead of gtag.js
- [Consent Mode](consent-mode)
- [How it stays safe with SSR](server-side-rendering)
