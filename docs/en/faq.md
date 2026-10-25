---
title: FAQ
slug: faq
order: 9
summary: Short answers to the questions people ask most.
---

# FAQ

### Does it work with server-side rendering?

Yes, that is what it was built for. On the server it does nothing; in the browser it starts after hydration. See [Server-side rendering](server-side-rendering).

### Why do I see every page view twice?

Google Analytics also counts history changes by itself. Turn off **Page changes based on browser history events** in the enhanced measurement settings of the web stream, as in [Getting started](getting-started#one-setting-in-google-analytics). With Tag Manager, also check that the `index.html` snippet is gone.

Google can take an hour or more to apply the change to the tag it serves, so the second page view may keep arriving for a while after you save. You can tell the two apart in the network tab: the package's page view carries `_ee=1`, while the one from history events comes a few seconds later without it.

### Does it work with NgModules?

Yes. Put `provideAnalytics()` in the `providers` of the root module and add `TrackEvent` to the `imports` of the module that uses the directive.

### Does it work without zone.js?

Yes. The package uses no zone.js API, and a spec runs it in a zoneless app.

### Do I need the router?

For automatic page views, yes: they follow the router's navigations. Custom events work without it.

### How do I see events while developing?

Install the Google Analytics Debugger extension in Chrome, or with Tag Manager open the container in Preview mode (Tag Assistant). Events then appear in Google Analytics › Admin › DebugView.

### Is the query string sent to Google?

Yes, `page_location` is the full address, as Google's own tag sends it. If addresses can contain personal data, such as an e-mail in a query parameter, keep it out of the address or remove it in the Google tag settings.

### Does it set cookies?

The package itself sets none. The Google tag sets the GA4 cookies, unless Consent Mode says `analytics_storage: 'denied'`.

### Can I use it with my own cookie banner?

Yes. Pass the choice to `updateConsent()`; any banner or consent tool that reports the visitor's choice works. See [Consent Mode](consent-mode).

### What about Content Security Policy?

Allow `https://www.googletagmanager.com` in `script-src`, plus the Google Analytics hosts in `connect-src` and `img-src`, as Google describes for its tag.

### I use 2.x. Do I have to move?

No, 2.x keeps working. Version 3 brings Tag Manager without a snippet, Consent Mode and the MIT licence. See [Moving from 2.x](migrating-from-2).
