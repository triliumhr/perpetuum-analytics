import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Router, provideRouter } from '@angular/router'

import { Analytics } from './analytics'
import { provideAnalytics } from './provide-analytics'
import { dataLayerEntries, forgetGoogle, scriptsLoadedFrom } from './testing/google-globals'

@Component({ template: '' })
class Page {}

function startApp(): Router {
    TestBed.configureTestingModule({
        providers: [
            provideRouter([{ path: 'shop', component: Page, title: 'Shop' }]),
            provideAnalytics({ tag: 'gtm', containerId: 'GTM-TEST' }),
        ],
    })
    return TestBed.inject(Router)
}

function dataLayerEvents(): unknown[] {
    return dataLayerEntries().filter((entry) => !Array.isArray(entry))
}

describe('Google Tag Manager', () => {
    afterEach(() => forgetGoogle())

    it('loads the container once when the app starts', () => {
        startApp()

        expect(scriptsLoadedFrom('googletagmanager.com').map((script) => script.src)).toEqual([
            'https://www.googletagmanager.com/gtm.js?id=GTM-TEST',
        ])
    })

    it('starts the container with the gtm.js event', () => {
        startApp()

        expect(dataLayerEvents()).toEqual([{ 'gtm.start': expect.any(Number), event: 'gtm.js' }])
    })

    it('pushes one page_view event per navigation, with the address and the title of the route', async () => {
        await startApp().navigateByUrl('/shop')

        expect(dataLayerEvents().slice(1)).toEqual([
            { event: 'page_view', page_location: 'http://localhost:3000/shop', page_title: 'Shop' },
        ])
    })

    it('pushes a custom event with its parameters', () => {
        startApp()

        TestBed.inject(Analytics).event('add_to_cart', { currency: 'EUR', value: 12.5 })

        expect(dataLayerEvents().slice(1)).toEqual([{ event: 'add_to_cart', currency: 'EUR', value: 12.5 }])
    })
})
