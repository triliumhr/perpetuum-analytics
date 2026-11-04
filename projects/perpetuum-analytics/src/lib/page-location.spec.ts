import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Router, provideRouter } from '@angular/router'

import { AnalyticsConfig, PageLocation } from './analytics-config'
import { provideAnalytics } from './provide-analytics'
import { dataLayerEntries, forgetGoogle, gtagCommands } from './testing/google-globals'

@Component({ template: '' })
class Page {}

const routes = [
    { path: 'search', component: Page, title: 'Search' },
    { path: 'orders/:id', component: Page, title: 'Order' },
]

function startApp(config: AnalyticsConfig): Router {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideAnalytics(config)] })
    return TestBed.inject(Router)
}

function withGtag(pageLocation: PageLocation): AnalyticsConfig {
    return { tag: 'gtag', measurementId: 'G-TEST123', pageLocation }
}

function sentLocations(): unknown[] {
    return gtagCommands('event').map((command) => (command[2] as { page_location: string }).page_location)
}

describe('pageLocation: cleaning addresses before they reach Google', () => {
    afterEach(() => forgetGoogle())

    it('removes every query parameter that is not on the allowlist', async () => {
        await startApp(withGtag({ keepQueryParams: ['q'] })).navigateByUrl('/search?q=bura&email=ana@example.com&token=abc')

        expect(sentLocations()).toEqual(['http://localhost:3000/search?q=bura'])
    })

    it('removes the whole query when the allowlist is empty', async () => {
        await startApp(withGtag({ keepQueryParams: [] })).navigateByUrl('/search?email=ana@example.com')

        expect(sentLocations()).toEqual(['http://localhost:3000/search'])
    })

    it('keeps every value of an allowed parameter', async () => {
        await startApp(withGtag({ keepQueryParams: ['tag', 'q'] })).navigateByUrl('/search?tag=a&utm=x&q=bura&tag=b')

        expect(sentLocations()).toEqual(['http://localhost:3000/search?tag=a&tag=b&q=bura'])
    })

    it('masks a path segment with a function', async () => {
        const maskOrderId = (address: URL): string => address.pathname.replace(/^\/orders\/[^/]+/, '/orders/:id')

        await startApp(withGtag(maskOrderId)).navigateByUrl('/orders/HR-2026-0042')

        expect(sentLocations()).toEqual(['http://localhost:3000/orders/:id'])
    })

    it('accepts a URL from the function and sends it as it is', async () => {
        const withoutQuery = (address: URL): URL => new URL(address.pathname, address.origin)

        await startApp(withGtag(withoutQuery)).navigateByUrl('/search?email=ana@example.com')

        expect(sentLocations()).toEqual(['http://localhost:3000/search'])
    })

    it('hands the function a copy, so changing it in place is enough', async () => {
        const dropEmail = (address: URL): URL => {
            address.searchParams.delete('email')
            return address
        }

        await startApp(withGtag(dropEmail)).navigateByUrl('/search?q=bura&email=ana@example.com')

        expect(sentLocations()).toEqual(['http://localhost:3000/search?q=bura'])
    })

    it('keeps the address on the app origin even when the function returns another one', async () => {
        await startApp(withGtag(() => 'https://elsewhere.example/search?q=bura')).navigateByUrl('/search')

        expect(sentLocations()).toEqual(['http://localhost:3000/search?q=bura'])
    })

    it('pushes the cleaned address to Tag Manager', async () => {
        await startApp({ tag: 'gtm', containerId: 'GTM-TEST', pageLocation: { keepQueryParams: [] } }).navigateByUrl(
            '/search?email=ana@example.com'
        )

        expect(dataLayerEntries()).toContainEqual({
            event: 'page_view',
            page_location: 'http://localhost:3000/search',
            page_title: 'Search',
        })
    })

    it('pushes the cleaned path under the 2.x names too', async () => {
        await startApp({
            tag: 'gtm',
            containerId: 'GTM-TEST',
            legacyEventNames: true,
            pageLocation: { keepQueryParams: [] },
        }).navigateByUrl('/search?email=ana@example.com')

        expect(dataLayerEntries()).toContainEqual({ event: 'pageview', page: { path: '/search', title: 'Search' } })
    })
})
