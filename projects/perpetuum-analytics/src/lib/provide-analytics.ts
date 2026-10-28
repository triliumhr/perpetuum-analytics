import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core'

import { Analytics } from './analytics'
import { ANALYTICS_CONFIG, AnalyticsConfig } from './analytics-config'

/**
 * Adds Google Analytics to the application: the tag loads when the app starts in the browser
 * (or on `Analytics.start()` with `start: 'manual'`) and every navigation becomes a page view.
 * On the server nothing is loaded or sent.
 */
export function provideAnalytics(config: AnalyticsConfig): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: ANALYTICS_CONFIG, useValue: config },
        provideAppInitializer(() => {
            if (config.start !== 'manual') inject(Analytics).start()
        }),
    ])
}
