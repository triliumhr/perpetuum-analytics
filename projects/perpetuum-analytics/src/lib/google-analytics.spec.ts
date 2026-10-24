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

function startApp(platform: 'browser' | 'server' = 'browser'): Router {
    TestBed.configureTestingModule({
        providers: [
            provideRouter(routes),
            provideAnalytics({ tag: 'gtag', measurementId: 'G-TEST123' }),
            { provide: PLATFORM_ID, useValue: platform },
        ],
    })
    return TestBed.inject(Router)
}

describe('Google Analytics 4 through gtag.js', () => {
    afterEach(() => forgetGoogle())

    it('loads gtag.js once for the measurement id when the app starts', () => {
        startApp()

        const loaders = scriptsLoadedFrom('googletagmanager.com')
        expect(loaders.map((script) => script.src)).toEqual(['https://www.googletagmanager.com/gtag/js?id=G-TEST123'])
        expect(loaders[0].async).toBe(true)
    })

    it('configures the measurement id and leaves page views to the router', () => {
        startApp()

        expect(gtagCommands('config')).toEqual([['config', 'G-TEST123', { send_page_view: false }]])
    })

    it('sends exactly one page view per navigation, with the address and the title of the route', async () => {
        const router = startApp()

        await router.navigateByUrl('/shop')
        await router.navigateByUrl('/')

        expect(gtagCommands('event')).toEqual([
            ['event', 'page_view', { page_location: 'http://localhost:3000/shop', page_title: 'Shop' }],
            ['event', 'page_view', { page_location: 'http://localhost:3000/', page_title: 'Home' }],
        ])
    })

    it('sends a custom event with its parameters', () => {
        startApp()

        TestBed.inject(Analytics).event('add_to_cart', { currency: 'EUR', value: 12.5 })

        expect(gtagCommands('event')).toEqual([['event', 'add_to_cart', { currency: 'EUR', value: 12.5 }]])
    })

    it('does nothing during server-side rendering', async () => {
        const router = startApp('server')

        await router.navigateByUrl('/shop')
        TestBed.inject(Analytics).event('add_to_cart', { value: 12.5 })

        expect(scriptsLoadedFrom('googletagmanager.com')).toEqual([])
        expect(dataLayerEntries()).toEqual([])
    })

    it('sends custom events in an app without the router', () => {
        TestBed.configureTestingModule({ providers: [provideAnalytics({ tag: 'gtag', measurementId: 'G-TEST123' })] })

        TestBed.inject(Analytics).event('sign_up', { method: 'email' })

        expect(gtagCommands('event')).toEqual([['event', 'sign_up', { method: 'email' }]])
    })
})
