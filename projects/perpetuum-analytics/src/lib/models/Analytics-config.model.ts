export type ITrackingType = 'analytics' | 'gtag' | 'gtm'

export interface IAnalyticsConfig {
    trackingId: string
    trackingType: ITrackingType
}

export interface IEventData {
    eventCategory: string
    eventAction: string
    eventLabel: string
    eventValue: number
}

// Exported since 1.x and empty; it goes away in 3.0, removing it now would break imports.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AnalyticsConfig {}
