import { Component } from '@angular/core'
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser'
import { renderApplication } from '@angular/platform-server'
import { RouterOutlet, provideRouter } from '@angular/router'

import { provideAnalytics } from './provide-analytics'
import { TrackEvent } from './track-event'
import { dataLayerEntries, forgetGoogle } from './testing/google-globals'

@Component({ selector: 'app-shop', imports: [TrackEvent], template: '<button perpetuumTrack="add_to_cart">Add to cart</button>' })
class Shop {}

@Component({ selector: 'app-root', imports: [RouterOutlet], template: '<router-outlet />' })
class Root {}

function renderOnTheServer(url: string): Promise<string> {
    const bootstrap = (context: BootstrapContext) =>
        bootstrapApplication(
            Root,
            {
                providers: [
                    provideRouter([{ path: 'shop', component: Shop, title: 'Shop' }]),
                    provideAnalytics({ tag: 'gtag', measurementId: 'G-TEST123', consentDefaults: { analytics_storage: 'denied' } }),
                ],
            },
            context
        )
    return renderApplication(bootstrap, { document: '<html><head></head><body><app-root></app-root></body></html>', url })
}

describe('Server-side rendering', () => {
    afterEach(() => forgetGoogle())

    it('renders the page with the platform server and leaves Google out of the HTML', async () => {
        const html = await renderOnTheServer('/shop')

        expect(html).toContain('Add to cart')
        expect(html).not.toContain('googletagmanager')
        expect(html).not.toContain('dataLayer')
    })

    it('touches no global data layer while rendering', async () => {
        await renderOnTheServer('/shop')

        expect(dataLayerEntries()).toEqual([])
    })
})
