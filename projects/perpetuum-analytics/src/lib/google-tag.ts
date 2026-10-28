import { AnalyticsConfig, ConsentState, EventParams, GoogleAnalyticsConfig, TagManagerConfig } from './analytics-config'

export interface PageView {
    /** The full address, as GA4 expects it. */
    readonly location: string
    /** The address inside the app, as the router knows it; 2.x sent this. */
    readonly path: string
    readonly title: string
}

/** The page's connection to Google, once the tag is on the page. */
export interface GoogleTag {
    pageView(view: PageView): void
    event(name: string, params: EventParams): void
    updateConsent(choices: ConsentState): void
}

type Gtag = (...commands: unknown[]) => void

/** `nonce` is the app's CSP_NONCE, so a strict Content Security Policy lets the tag's script run. */
export function installGoogleTag(document: Document, config: AnalyticsConfig, nonce: string | null): GoogleTag {
    // Consent Mode needs the defaults on the data layer before the tag's first command.
    if (config.consentDefaults) gtagOn(document)('consent', 'default', config.consentDefaults)

    switch (config.tag) {
        case 'gtag':
            return installGtag(document, config, nonce)
        case 'gtm':
            return installTagManager(document, config, nonce)
    }
}

function installGtag(document: Document, config: GoogleAnalyticsConfig, nonce: string | null): GoogleTag {
    const gtag = gtagOn(document)
    gtag('js', new Date())
    // The router reports every navigation, the first one included; gtag's own page view would count it twice.
    gtag('config', config.measurementId, { send_page_view: false })
    loadScript(document, `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.measurementId)}`, nonce)

    return {
        pageView: (view) => gtag('event', 'page_view', { page_location: view.location, page_title: view.title }),
        event: (name, params) => gtag('event', name, params),
        updateConsent: (choices) => gtag('consent', 'update', choices),
    }
}

function installTagManager(document: Document, config: TagManagerConfig, nonce: string | null): GoogleTag {
    const gtag = gtagOn(document)
    const dataLayer = dataLayerOf(windowOf(document))
    dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    loadScript(document, `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.containerId)}`, nonce)

    const push = (entry: object) => dataLayer.push(entry)

    return {
        ...(config.legacyEventNames ? legacyDataLayerEvents(push) : dataLayerEvents(push)),
        // Tag Manager reads consent from the same gtag commands as gtag.js.
        updateConsent: (choices) => gtag('consent', 'update', choices),
    }
}

type DataLayerEvents = Pick<GoogleTag, 'pageView' | 'event'>

function dataLayerEvents(push: (entry: object) => void): DataLayerEvents {
    return {
        pageView: (view) => push({ page_location: view.location, page_title: view.title, event: 'page_view' }),
        // The name goes last, so a parameter called `event` cannot turn one event into another.
        event: (name, params) => push({ ...params, event: name }),
    }
}

/** The shapes 2.x pushed, which containers built for it still listen for. */
function legacyDataLayerEvents(push: (entry: object) => void): DataLayerEvents {
    return {
        pageView: (view) => push({ event: 'pageview', page: { path: view.path, title: view.title } }),
        // `event` goes last, as in dataLayerEvents, so no parameter can rename the event.
        event: (name, { event_category, event_label, value, ...others }) =>
            push({
                ...others,
                event: 'GAEvent',
                eventCategory: event_category,
                eventAction: name,
                eventLabel: event_label,
                eventValue: value,
            }),
    }
}

/** The standard gtag() function on the page's data layer, created if the page has none yet. */
function gtagOn(document: Document): Gtag {
    const view = windowOf(document)
    const dataLayer = dataLayerOf(view)
    // gtag.js reads only `arguments` objects from the data layer, not arrays, so this stays a classic function.
    const gtag: Gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        dataLayer.push(arguments)
    }
    Reflect.set(view, 'gtag', gtag)
    return gtag
}

function windowOf(document: Document): Window {
    const view = document.defaultView
    if (!view) throw new Error('perpetuum-analytics needs a browser window to load the Google tag.')
    return view
}

function dataLayerOf(view: Window): unknown[] {
    const existing: unknown = Reflect.get(view, 'dataLayer')
    if (Array.isArray(existing)) return existing

    const dataLayer: unknown[] = []
    Reflect.set(view, 'dataLayer', dataLayer)
    return dataLayer
}

function loadScript(document: Document, src: string, nonce: string | null): void {
    const script = document.createElement('script')
    script.async = true
    script.src = src
    if (nonce) script.nonce = nonce
    document.head.appendChild(script)
}
