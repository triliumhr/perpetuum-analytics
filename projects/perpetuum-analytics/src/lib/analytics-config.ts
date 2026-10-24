import { InjectionToken } from '@angular/core'

/** Google Consent Mode v2 signals, as Google names them. */
export type ConsentSignal = 'analytics_storage' | 'ad_storage' | 'ad_user_data' | 'ad_personalization'

export type ConsentState = Readonly<Partial<Record<ConsentSignal, 'granted' | 'denied'>>>

interface SharedConfig {
    /** Consent Google assumes until the app calls `updateConsent()`. Without it, the tag sends no consent command. */
    readonly consentDefaults?: ConsentState
}

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
}

export type AnalyticsConfig = GoogleAnalyticsConfig | TagManagerConfig

/** Parameters of an event, as Google Analytics 4 names them (`value`, `currency`, `items`…). */
export type EventParams = Readonly<Record<string, unknown>>

export const ANALYTICS_CONFIG = new InjectionToken<AnalyticsConfig>('perpetuum-analytics config')
