import { Component, PLATFORM_ID } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Router, provideRouter } from '@angular/router'

import { Analytics } from './analytics'
import { provideAnalytics } from './provide-analytics'
import { dataLayerEntries, forgetGoogle, gtagCommands, scriptsLoadedFrom } from './testing/google-globals'

@Component({ template: '' })
class Page {}

const routes = [
    { path: '', component: Page, title: 'Home' },
    { path: 'shop', component: Page, title: 'Shop' },
]

function startAppWithoutAnalytics(platform: 'browser' | 'server' = 'browser'): Router {
    TestBed.configureTestingModule({
        providers: [
            provideRouter(routes),
            provideAnalytics({ tag: 'gtag', measurementId: 'G-TEST123', start: 'manual' }),
            { provide: PLATFORM_ID, useValue: platform },
        ],
    })
    return TestBed.inject(Router)
}

/** The router sets the title right after NavigationEnd; the page view follows in the next microtask. */
const pageViewsSettle = () => new Promise<void>((resolve) => setTimeout(resolve))

describe("start: 'manual'", () => {
    afterEach(() => forgetGoogle())

    it('loads nothing from Google until the app calls start()', async () => {
        const router = startAppWithoutAnalytics()

        await router.navigateByUrl('/shop')
        await pageViewsSettle()

        expect(scriptsLoadedFrom('googletagmanager.com')).toEqual([])
        expect(dataLayerEntries()).toEqual([])
    })

    it('loads the tag once on start() and sends the page view of the current page', async () => {
        const router = startAppWithoutAnalytics()
        await router.navigateByUrl('/shop')
        await pageViewsSettle()

        TestBed.inject(Analytics).start()

        expect(scriptsLoadedFrom('googletagmanager.com').map((script) => script.src)).toEqual([
            'https://www.googletagmanager.com/gtag/js?id=G-TEST123',
        ])
        expect(gtagCommands('event')).toEqual([['event', 'page_view', { page_location: 'http://localhost:3000/shop', page_title: 'Shop' }]])
    })

    it('sends a page view for every navigation after start()', async () => {
        const router = startAppWithoutAnalytics()
        await router.navigateByUrl('/shop')
        TestBed.inject(Analytics).start()

        await router.navigateByUrl('/')
        await pageViewsSettle()

        expect(gtagCommands('event').map((command) => command[2])).toEqual([
            { page_location: 'http://localhost:3000/shop', page_title: 'Shop' },
            { page_location: 'http://localhost:3000/', page_title: 'Home' },
        ])
    })

    it('treats a second start() as done already', async () => {
        const router = startAppWithoutAnalytics()
        await router.navigateByUrl('/shop')
        const analytics = TestBed.inject(Analytics)

        analytics.start()
        analytics.start()

        expect(scriptsLoadedFrom('googletagmanager.com')).toHaveLength(1)
        expect(gtagCommands('event')).toHaveLength(1)
    })

    it('stays quiet on the server, even after start()', async () => {
        const router = startAppWithoutAnalytics('server')
        await router.navigateByUrl('/shop')

        TestBed.inject(Analytics).start()

        expect(scriptsLoadedFrom('googletagmanager.com')).toEqual([])
        expect(dataLayerEntries()).toEqual([])
    })
})
