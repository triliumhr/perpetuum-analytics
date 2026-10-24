import { Component, PLATFORM_ID } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { DOCUMENT } from '@angular/common'
import { Title } from '@angular/platform-browser'
import { Router, provideRouter } from '@angular/router'

import { AnalyticsService } from './analytics.service'
import { IAnalyticsConfig } from './models/Analytics-config.model'

@Component({ template: '' })
class EmptyPage {}

const gtagConfig: IAnalyticsConfig = { trackingId: 'G-TEST123', trackingType: 'gtag' }

function analyticsFor(config: IAnalyticsConfig, platform: 'browser' | 'server' = 'browser'): AnalyticsService {
    TestBed.configureTestingModule({
        providers: [
            provideRouter([{ path: 'shop', component: EmptyPage }]),
            { provide: 'gaConfig', useValue: config },
            { provide: PLATFORM_ID, useValue: platform },
        ],
    })
    return TestBed.inject(AnalyticsService)
}

function scriptsInBody(): HTMLScriptElement[] {
    return Array.from(TestBed.inject(DOCUMENT).body.querySelectorAll('script'))
}

describe('AnalyticsService', () => {
    const gtag = vi.fn()
    const dataLayer: unknown[] = []

    beforeEach(() => {
        vi.stubGlobal('gtag', gtag)
        vi.stubGlobal('dataLayer', dataLayer)
    })

    afterEach(() => {
        document.body.querySelectorAll('script').forEach((script) => script.remove())
        gtag.mockReset()
        dataLayer.length = 0
        vi.unstubAllGlobals()
        vi.useRealTimers()
    })

    describe('on the server', () => {
        it('adds no scripts, so server-side rendering stays untouched', () => {
            analyticsFor(gtagConfig, 'server').setGoogleAnalyticsScripts()

            expect(scriptsInBody()).toEqual([])
        })
    })

    describe('with gtag.js', () => {
        it('loads gtag.js for the configured measurement id', () => {
            analyticsFor(gtagConfig).setGoogleAnalyticsScripts()

            const loader = scriptsInBody().find((script) => script.src.includes('googletagmanager.com'))
            expect(loader?.src).toBe('https://www.googletagmanager.com/gtag/js?id=G-TEST123')
            expect(loader?.hasAttribute('async')).toBe(true)
        })

        it('configures gtag with the measurement id', () => {
            analyticsFor(gtagConfig).setGoogleAnalyticsScripts()

            const setup = scriptsInBody().find((script) => script.text.includes("gtag('config'"))
            expect(setup?.text).toContain("gtag('config', 'G-TEST123')")
        })

        it('sends a page view with the title and path half a second after each navigation', async () => {
            vi.useFakeTimers()
            const analytics = analyticsFor(gtagConfig)
            analytics.setGoogleAnalyticsScripts()
            TestBed.inject(Title).setTitle('Shop')

            await TestBed.inject(Router).navigateByUrl('/shop')
            await vi.advanceTimersByTimeAsync(500)

            expect(gtag).toHaveBeenCalledWith('config', 'G-TEST123', { page_title: 'Shop', page_path: '/shop' })
        })

        it('sends a custom event with its category, label and value', () => {
            analyticsFor(gtagConfig).sendEvent({
                eventCategory: 'Cart',
                eventAction: 'add_to_cart',
                eventLabel: 'Kenya AA',
                eventValue: 12,
            })

            expect(gtag).toHaveBeenCalledWith('event', 'add_to_cart', { event_category: 'Cart', event_label: 'Kenya AA', value: 12 })
        })
    })

    describe('with Google Tag Manager', () => {
        it('pushes a custom event to the data layer', () => {
            analyticsFor({ trackingId: 'GTM-TEST', trackingType: 'gtm' }).sendEvent({
                eventCategory: 'Cart',
                eventAction: 'add_to_cart',
                eventLabel: 'Kenya AA',
                eventValue: 12,
            })

            expect(dataLayer).toEqual([
                { event: 'GAEvent', eventCategory: 'Cart', eventAction: 'add_to_cart', eventLabel: 'Kenya AA', eventValue: 12 },
            ])
        })
    })
})
