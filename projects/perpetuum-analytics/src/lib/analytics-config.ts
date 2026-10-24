import { InjectionToken } from '@angular/core'

/** Which Google tag the app uses and the id it reports to. */
export interface GoogleAnalyticsConfig {
    readonly tag: 'gtag'
    /** The GA4 measurement id, `G-…`. */
    readonly measurementId: string
}

export interface TagManagerConfig {
    readonly tag: 'gtm'
    /** The Google Tag Manager container id, `GTM-…`. */
    readonly containerId: string
}

export type AnalyticsConfig = GoogleAnalyticsConfig | TagManagerConfig

/** Parameters of an event, as Google Analytics 4 names them (`value`, `currency`, `items`…). */
export type EventParams = Readonly<Record<string, unknown>>

export const ANALYTICS_CONFIG = new InjectionToken<AnalyticsConfig>('perpetuum-analytics config')
