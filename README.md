# perpetuum-analytics lives on as `@triliumhr/perpetuum-analytics`

The package is actively maintained, by the same author, at a new address and with a new major version. Version 3 is [`@triliumhr/perpetuum-analytics`](https://www.npmjs.com/package/@triliumhr/perpetuum-analytics): the same SSR-safe Google Analytics for Angular, now with Google Tag Manager, Consent Mode, a standalone `provideAnalytics()` and the MIT licence. It has [a published support policy](https://github.com/triliumhr/perpetuum-analytics/blob/main/docs/en/10-support.md) and [a public roadmap](https://github.com/triliumhr/perpetuum-analytics/blob/main/ROADMAP.md).

-   **Moving:** `npm uninstall perpetuum-analytics && npm install @triliumhr/perpetuum-analytics`, then follow the [guide for moving from 2.x](https://github.com/triliumhr/perpetuum-analytics/blob/main/docs/en/06-migrating-from-2.md). It maps every 2.x call to its 3.x counterpart.
-   **Angular versions:** 3.x supports Angular 21 and 22. On an older Angular, stay on 2.x until you upgrade Angular.
-   **2.x keeps working.** It gets security fixes until 30 April 2027, with no new features and no new Angular versions. After that date it stays on npm as it is.
-   **Security reports:** see [SECURITY.md](https://github.com/triliumhr/perpetuum-analytics/blob/main/SECURITY.md).

The 2.x documentation follows below, unchanged.

---

# Perpetuum Ng Analytics

[![](https://img.shields.io/badge/version-1.1.4-green.svg)](https://perpetuum.eu)
[![](https://img.shields.io/badge/Angular-7+-informational.svg)](https://angular.io)

![PerpetuumNgAnalytics](https://repository-images.githubusercontent.com/239224377/1e536b00-4b7d-11ea-8f95-3681c51d54bd)

## About

This is Angular module that enables easy Google Analytics integration into Angular SPA-s, and most importantly it is 100% SSR compatible, so you can use it even if you are running Angular Universal, it won't break the server side rendering.

Tracking is possible using any script provided by Google Analytics, but we recommend using [global site tag](<https://developers.google.com/analytics/devguides/collection/gtagjs#:~:text=The%20global%20site%20tag%20(gtag,non%2Dproduct%20specific)%20gtag.>) (gtag.js)

Tested with Angular 7+ although it might work with older versions as well.

## Google Analytics 4 support

You can use this module with the GA4, but you have to use [global site tag](<https://developers.google.com/analytics/devguides/collection/gtagjs#:~:text=The%20global%20site%20tag%20(gtag,non%2Dproduct%20specific)%20gtag.>) (gtag.js)
If you are already using this module with Universal Analytics, follow the [migration guide](https://support.google.com/analytics/answer/10759417?hl=en), make sure to instantiate the perpetuum-analytics module using gtag as trackingType

Congrats, you are good to go, everything else can stay the same.

## Installation and configuration

-   Install package using npm `npm i perpetuum-analytics`
-   in your app.module.ts add Module to imports array:

```javascript
import { ITrackingType, AnalyticsModule } from 'perpetuum-analytics'

...

constructor(
    private analyticsService: AnalyticsService
) {}

...

imports: [
    ...
    AnalyticsModule.forRoot({
        trackingId: <YOUR TRACKING ID>,
        trackingType: 'gtag',
    }),
],
```

Replace <YOUR TRACKING ID> with Google Analytics ID ([Find your Analytics tracking id](https://support.google.com/analytics/answer/1008080?hl=en))
Supported tracking types are 'analytics', 'gtag' or 'gtm'.

-   in your app.component.ts initialize tracking like this:

```javascript
import { AnalyticsService } from 'perpetuum-analytics'

...

ngOnInit(): void {
   this.analyticsService.setGoogleAnalyticsScripts()
}
```

Note that we need to pass a reference to renderer as a param

If you are in EU and need to be GDPR-compliant, you can first check if you have user permission to use analytics, and initialize module conditionally.

This method will generate tracking script, and it will initialize tracking, you are all set. Every route change will send event to Google Analytics.

## Sending custom click events using directive

PerpetuumAnalytics module provides directive, so you can easily send custom events for any element in your application

Let's say tact we have "Add to cart" button, and we would like to track user interactions. We can easily bind a directive to any element and send custom event whenever user clicks on our button

```html
<button
    [perpetuumAnalytics]="{ eventCategory: 'Sample category', eventAction: 'Add to cart click', eventLabel: 'item.name', eventValue: item.price }"
    (click)="addToCart(item)"
>
    Add to cart
</button>
```

Here we are binding directive to our button, and we are passing event data object as argument to our directive

## Issues

For any known issues check list of opened [issues](https://github.com/nrozic/perpetuum-ng-analytics/issues) and if you find any issue with this module, please consider opening an [issue](https://github.com/nrozic/perpetuum-ng-analytics/issues/new) with description

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.21.

## Potential breaking changes from version 2.0.0

You don't have to pass renderer2 as param from the component when calling setGoogleAnalyticsScripts method in analytics service.
Method argument is deprecated and can/will be removed in future versions
