import { TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'

import { Analytics } from './analytics'
import { AnalyticsConfig } from './analytics-config'
import { provideAnalytics } from './provide-analytics'
import { dataLayerEntries, forgetGoogle, gtagCommands } from './testing/google-globals'

function startApp(config: AnalyticsConfig): Analytics {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideAnalytics(config)] })
    return TestBed.inject(Analytics)
}

const deniedUntilAsked = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
} as const

describe('Consent Mode', () => {
    afterEach(() => forgetGoogle())

    it('sets the default consent before anything else reaches Google', () => {
        startApp({ tag: 'gtag', measurementId: 'G-TEST', consentDefaults: deniedUntilAsked })

        expect(dataLayerEntries()[0]).toEqual(['consent', 'default', deniedUntilAsked])
    })

    it('sends no consent command when the app sets no defaults', () => {
        startApp({ tag: 'gtag', measurementId: 'G-TEST' })

        expect(gtagCommands('consent')).toEqual([])
    })

    it('updates consent when the app passes on a choice', () => {
        const analytics = startApp({ tag: 'gtag', measurementId: 'G-TEST', consentDefaults: deniedUntilAsked })

        analytics.updateConsent({ analytics_storage: 'granted' })

        expect(gtagCommands('consent').at(-1)).toEqual(['consent', 'update', { analytics_storage: 'granted' }])
    })

    it('speaks the same consent commands to a Tag Manager container, ahead of the gtm.js event', () => {
        const analytics = startApp({ tag: 'gtm', containerId: 'GTM-TEST', consentDefaults: deniedUntilAsked })

        analytics.updateConsent({ ad_storage: 'granted' })

        expect(dataLayerEntries()[0]).toEqual(['consent', 'default', deniedUntilAsked])
        expect(gtagCommands('consent').at(-1)).toEqual(['consent', 'update', { ad_storage: 'granted' }])
    })
})
