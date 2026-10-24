# Perpetuum Ng Analytics

Google Analytics for Angular that is safe with server-side rendering: on the server it does nothing, in the browser it loads the tag and sends a page view after every navigation.

Published on npm as [`perpetuum-analytics`](https://www.npmjs.com/package/perpetuum-analytics). Works with Angular 21 and 22.

## Installation

```bash
npm install perpetuum-analytics
```

Add the module with your measurement id (`G-…`) to the application:

```ts
import { AnalyticsModule } from 'perpetuum-analytics'

@NgModule({
    imports: [
        AnalyticsModule.forRoot({
            trackingId: 'G-XXXXXXXXXX',
            trackingType: 'gtag',
        }),
    ],
})
export class AppModule {}
```

In a standalone application, use `importProvidersFrom(AnalyticsModule.forRoot({ … }))` in the application providers.

Start tracking once, when the application starts:

```ts
import { AnalyticsService } from 'perpetuum-analytics'

export class AppComponent implements OnInit {
    private analytics = inject(AnalyticsService)

    ngOnInit(): void {
        this.analytics.setGoogleAnalyticsScripts()
    }
}
```

The service loads gtag.js and sends a page view with the page title and path after each navigation. If your site asks visitors for consent first, call `setGoogleAnalyticsScripts()` only after they agree.

`trackingType` also accepts `'gtm'` and `'analytics'`. With those, the service expects the Google Tag Manager or analytics.js snippet to be on the page already. For Google Analytics 4, use `'gtag'`.

## Custom events

The `perpetuumAnalytics` directive sends an event when its element is clicked:

```html
<button
    type="button"
    [perpetuumAnalytics]="{ eventCategory: 'Cart', eventAction: 'add_to_cart', eventLabel: item.name, eventValue: item.price }"
    (click)="addToCart(item)"
>
    Add to cart
</button>
```

From code, call `analytics.sendEvent({ eventCategory, eventAction, eventLabel, eventValue })`.

## From 1.x to 2.x

`setGoogleAnalyticsScripts()` no longer needs a `Renderer2`. The argument is still accepted and ignored.

## Development

The repository is an Angular CLI workspace with the library in `projects/perpetuum-analytics`. You need Node.js 22.22.3 or 24.15 and newer.

```bash
npm ci
npm test          # Vitest specs
npm run lint      # ESLint with angular-eslint
npm run build     # the package in dist/perpetuum-analytics
npm run pack:check  # build, npm pack --dry-run and publint
```

GitHub Actions runs the same checks on every pull request, and the specs also run on Angular 21.

## Questions and ideas

Open an [issue](https://github.com/nrozic/perpetuum-ng-analytics/issues) and describe what you would like the package to do.

## Licence

[GPL-3.0](LICENSE.md)
