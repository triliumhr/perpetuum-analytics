---
title: Roadmap
slug: roadmap
order: 8
summary: What comes next for Perpetuum Analytics and how Angular versions are supported.
---

# Roadmap

Each item becomes a GitHub issue under its milestone, and each release lists what it delivered in the changelog. Ideas and votes are welcome in [GitHub issues](https://github.com/triliumhr/perpetuum-analytics/issues).

## Now: 3.0

SSR-safe GA4 and Google Tag Manager with `provideAnalytics()`, custom events, Consent Mode v2, 100 % coverage and an end-to-end SSR test on every pull request. See [How we test](testing).

## Next: 3.1, privacy and strict sites

- **CSP nonce:** the Google tag script carries Angular's `CSP_NONCE`, so sites with a strict Content Security Policy need no host-wide exception.
- **Clean addresses:** a `pageLocation` option that removes query parameters or masks parts of the path before they reach Google, e.g. an e-mail in `?email=` or an order id in `/orders/:id`.
- **Start after consent:** `start: 'manual'` and `analytics.start()`, so nothing loads until the visitor agrees, for sites that choose this over [Consent Mode](consent-mode).

## Then: 3.2, richer measurement

- **Typed GA4 events:** recommended and ecommerce events (`purchase`, `add_to_cart`, `begin_checkout`…) with typed parameters and `items`.
- **User id and user properties** for signed-in visitors.
- **Debug mode** as an option, without a browser extension.
- **Route data:** a route can rename its page view, set its own title or skip it.

## Later: under consideration

- A testing helper that records events in specs of the apps that use the package.
- Server-side tagging (a custom `transport_url`).
- Other measurement tools behind the same API, if users ask for them.

## Support policy

- Each Angular major is supported from its first stable release, and the two newest majors are supported at the same time (now 21 and 22).
- Security fixes come first, in a patch release of the current major.
- A breaking change comes only in a new major, with a [migration guide](migrating-from-2).
