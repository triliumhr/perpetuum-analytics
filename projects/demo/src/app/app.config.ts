import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import { provideAnalytics } from '@triliumhr/perpetuum-analytics'

import { routes } from './app.routes'

// The demo shows both ways to respect consent. By default the tag loads at once and Consent Mode keeps it from storing anything;
// opened with ?start=manual, it loads nothing from Google until the visitor allows statistics. On the server neither loads anything.
const asksFirst = new URLSearchParams(globalThis.location?.search).get('start') === 'manual'

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideClientHydration(),
        provideAnalytics({
            tag: 'gtag',
            measurementId: 'G-DEMO000000',
            start: asksFirst ? 'manual' : 'auto',
            consentDefaults: { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' },
        }),
    ],
}
