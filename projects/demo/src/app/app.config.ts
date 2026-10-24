import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import { provideAnalytics } from '@triliumhr/perpetuum-analytics'

import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideClientHydration(),
        provideAnalytics({
            tag: 'gtag',
            measurementId: 'G-DEMO000000',
            consentDefaults: { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' },
        }),
    ],
}
