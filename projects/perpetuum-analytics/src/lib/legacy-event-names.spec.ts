import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Router, provideRouter } from '@angular/router'

import { Analytics } from './analytics'
import { provideAnalytics } from './provide-analytics'
import { dataLayerEntries, forgetGoogle } from './testing/google-globals'

@Component({ template: '' })
class Page {}

function startAppWithLegacyNames(): Router {
    TestBed.configureTestingModule({
        providers: [
            provideRouter([{ path: 'shop', component: Page, title: 'Shop' }]),
            provideAnalytics({ tag: 'gtm', containerId: 'GTM-TEST', legacyEventNames: true }),
        ],
    })
    return TestBed.inject(Router)
}

/** What the app pushed after the container's own gtm.js event. */
function pushedByTheApp(): unknown[] {
    return dataLayerEntries()
        .filter((entry) => !Array.isArray(entry))
        .slice(1)
}

describe('Tag Manager with legacyEventNames, as 2.x sent them', () => {
    afterEach(() => forgetGoogle())

    it('pushes each page view as a pageview event with the page path and title', async () => {
        await startAppWithLegacyNames().navigateByUrl('/shop?colour=red')

        expect(pushedByTheApp()).toEqual([{ event: 'pageview', page: { path: '/shop?colour=red', title: 'Shop' } }])
    })

    it('pushes a custom event as GAEvent, with category, action, label and value under their 2.x names', () => {
        startAppWithLegacyNames()

        TestBed.inject(Analytics).event('add_to_cart', { event_category: 'shop', event_label: 'Bura', value: 12.5 })

        expect(pushedByTheApp()).toEqual([
            { event: 'GAEvent', eventCategory: 'shop', eventAction: 'add_to_cart', eventLabel: 'Bura', eventValue: 12.5 },
        ])
    })

    it('keeps any other parameters next to the 2.x names', () => {
        startAppWithLegacyNames()

        TestBed.inject(Analytics).event('sign_up', { method: 'email', event: 'purchase' })

        expect(pushedByTheApp()).toEqual([
            { event: 'GAEvent', method: 'email', eventCategory: undefined, eventAction: 'sign_up', eventLabel: undefined, eventValue: undefined },
        ])
    })
})
