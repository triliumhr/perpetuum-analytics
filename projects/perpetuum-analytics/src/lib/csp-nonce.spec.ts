import { CSP_NONCE } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Router, provideRouter } from '@angular/router'

import { AnalyticsConfig } from './analytics-config'
import { provideAnalytics } from './provide-analytics'
import { forgetGoogle, scriptsLoadedFrom } from './testing/google-globals'

function startApp(config: AnalyticsConfig, nonce?: string): HTMLScriptElement {
    TestBed.configureTestingModule({
        providers: [provideRouter([]), provideAnalytics(config), ...(nonce === undefined ? [] : [{ provide: CSP_NONCE, useValue: nonce }])],
    })
    TestBed.inject(Router)
    return scriptsLoadedFrom('googletagmanager.com')[0]
}

describe('Content Security Policy nonce', () => {
    afterEach(() => forgetGoogle())

    it('puts the app nonce on the gtag.js script', () => {
        const script = startApp({ tag: 'gtag', measurementId: 'G-TEST123' }, 'r4nd0m')

        expect(script.nonce).toBe('r4nd0m')
    })

    it('puts the app nonce on the gtm.js script', () => {
        const script = startApp({ tag: 'gtm', containerId: 'GTM-TEST' }, 'r4nd0m')

        expect(script.nonce).toBe('r4nd0m')
    })

    it('adds no nonce attribute when the app has no CSP_NONCE', () => {
        const script = startApp({ tag: 'gtag', measurementId: 'G-TEST123' })

        expect(script.hasAttribute('nonce')).toBe(false)
    })
})
