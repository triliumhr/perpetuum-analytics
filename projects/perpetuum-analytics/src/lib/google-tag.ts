import { AnalyticsConfig, EventParams } from './analytics-config'

export interface PageView {
    readonly page_location: string
    readonly page_title: string
}

/** The page's connection to Google, once the tag is on the page. */
export interface GoogleTag {
    pageView(view: PageView): void
    event(name: string, params: EventParams): void
}

type Gtag = (...commands: unknown[]) => void

export function installGoogleTag(document: Document, config: AnalyticsConfig): GoogleTag {
    const gtag = gtagOn(document)
    gtag('js', new Date())
    // The router reports every navigation, the first one included; gtag's own page view would count it twice.
    gtag('config', config.measurementId, { send_page_view: false })
    loadScript(document, `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.measurementId)}`)

    return {
        pageView: (view) => gtag('event', 'page_view', view),
        event: (name, params) => gtag('event', name, params),
    }
}

/** The standard gtag() function on the page's data layer, created if the page has none yet. */
function gtagOn(document: Document): Gtag {
    const view = document.defaultView
    if (!view) throw new Error('perpetuum-analytics needs a browser window to load the Google tag.')

    const dataLayer = dataLayerOf(view)
    // gtag.js reads only `arguments` objects from the data layer, not arrays, so this stays a classic function.
    const gtag: Gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        dataLayer.push(arguments)
    }
    Reflect.set(view, 'gtag', gtag)
    return gtag
}

function dataLayerOf(view: Window): unknown[] {
    const existing: unknown = Reflect.get(view, 'dataLayer')
    if (Array.isArray(existing)) return existing

    const dataLayer: unknown[] = []
    Reflect.set(view, 'dataLayer', dataLayer)
    return dataLayer
}

function loadScript(document: Document, src: string): void {
    const script = document.createElement('script')
    script.async = true
    script.src = src
    document.head.appendChild(script)
}
