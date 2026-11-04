import { InjectionToken } from '@angular/core'

/** Google Consent Mode v2 signals, as Google names them. */
export type ConsentSignal = 'analytics_storage' | 'ad_storage' | 'ad_user_data' | 'ad_personalization'

export type ConsentState = Readonly<Partial<Record<ConsentSignal, 'granted' | 'denied'>>>

interface SharedConfig {
    /** Consent Google assumes until the app calls `updateConsent()`. Without it, the tag sends no consent command. */
    readonly consentDefaults?: ConsentState
    /**
     * `'auto'` (default) loads the tag when the app starts. `'manual'` waits for `Analytics.start()`,
     * for apps that may load nothing from Google before the visitor agrees, as `setGoogleAnalyticsScripts()` did in 2.x.
     */
    readonly start?: 'auto' | 'manual'
    /**
     * Cleans the page address before it reaches Google, for addresses that carry personal data
     * (`?email=`, tokens, order numbers). Without it, Google gets the address as the visitor sees it.
     */
    readonly pageLocation?: PageLocation
}

/**
 * `{ keepQueryParams }` keeps only the listed query parameters and drops the rest.
 * A function gets a copy of the address and returns the one to send, as a `URL` or a string;
 * a relative string resolves against the page. The result always stays on the app's origin.
 */
export type PageLocation = ((address: URL) => URL | string) | { readonly keepQueryParams: readonly string[] }

/** Which Google tag the app uses and the id it reports to. */
export interface GoogleAnalyticsConfig extends SharedConfig {
    readonly tag: 'gtag'
    /** The GA4 measurement id, `G-…`. */
    readonly measurementId: string
}

export interface TagManagerConfig extends SharedConfig {
    readonly tag: 'gtm'
    /** The Google Tag Manager container id, `GTM-…`. */
    readonly containerId: string
    /**
     * Pushes page views as `pageview` and events as `GAEvent`, under the names 2.x used,
     * so a container built for 2.x keeps counting without changes.
     */
    readonly legacyEventNames?: boolean
}

export type AnalyticsConfig = GoogleAnalyticsConfig | TagManagerConfig

/** Parameters of an event, as Google Analytics 4 names them (`value`, `currency`, `items`…). */
export type EventParams = Readonly<Record<string, unknown>>

export const ANALYTICS_CONFIG = new InjectionToken<AnalyticsConfig>('perpetuum-analytics config')
