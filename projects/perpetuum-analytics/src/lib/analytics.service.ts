import { Injectable, Inject, PLATFORM_ID, Renderer2, RendererFactory2, inject } from '@angular/core'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { DOCUMENT, isPlatformBrowser } from '@angular/common'
import { delay, filter, map, mergeMap } from 'rxjs/operators'
import { Title } from '@angular/platform-browser'

import { IAnalyticsConfig, IEventData } from './models/Analytics-config.model'

declare const gtag: (...commands: unknown[]) => void
declare const ga: (...commands: unknown[]) => void
declare const dataLayer: unknown[]

@Injectable({
    providedIn: 'root',
})
export class AnalyticsService {
    protected platformId = inject(PLATFORM_ID)
    private document = inject(DOCUMENT)
    private router = inject(Router)
    private activatedRoute = inject(ActivatedRoute)
    private titleService = inject(Title)
    private renderer: Renderer2 = inject(RendererFactory2).createRenderer(null, null)

    // The string token 'gaConfig' is public API in 2.x (apps may provide it without forRoot),
    // and inject() only accepts typed tokens, so the configuration keeps constructor injection.
    // eslint-disable-next-line @angular-eslint/prefer-inject
    constructor(@Inject('gaConfig') private config: IAnalyticsConfig) {}

    static gaSendEvent(data: IEventData): void {
        ga('send', 'event', data)
    }

    static dataLayerSendEvent(data: IEventData): void {
        dataLayer.push({
            event: 'GAEvent',
            eventCategory: data.eventCategory,
            eventAction: data.eventAction,
            eventLabel: data.eventLabel,
            eventValue: data.eventValue,
        })
    }

    static gtagSendEvent(data: IEventData): void {
        gtag('event', data.eventAction, {
            event_category: data.eventCategory,
            event_label: data.eventLabel,
            value: data.eventValue,
        })
    }

    /**
     * @description It will initialize Google Analytics module and tracking. Call this method when application boots up.
     * Good place to call this method is in `app.component` on init
     *
     * @param _renderer Deprecated since 2.0.0 and ignored: the service creates its own renderer.
     * It stays optional so that existing calls keep compiling.
     */
    setGoogleAnalyticsScripts(_renderer?: Renderer2): void {
        if (isPlatformBrowser(this.platformId)) {
            switch (this.config.trackingType) {
                case 'analytics':
                    this._gaSend()
                    break
                case 'gtm':
                    this._dataLayerSend()
                    break
                default:
                    this._setGtag()
                    break
            }
        }
    }
    /**
     * Method to send event to Google Analytics. It can be used from components and services to send custom events
     *
     * @param data Object with data that will be sent for event
     */
    sendEvent(data: IEventData): void {
        switch (this.config.trackingType) {
            case 'analytics':
                AnalyticsService.gaSendEvent(data)
                break
            case 'gtm':
                AnalyticsService.dataLayerSendEvent(data)
                break
            default:
                AnalyticsService.gtagSendEvent(data)
                break
        }
    }

    /**
     * @description It will create gtag script tag dynamically using tracking ID provided in configuration
     */
    private _setGtag(): void {
        if (this.config.trackingType === 'gtag') {
            const gatag: HTMLScriptElement = this.renderer.createElement('script')
            gatag.setAttribute('async', '')
            gatag.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.trackingId}`
            this.renderer.appendChild(this.document.body, gatag)
        }

        this._setGoogleAnalyticsScriptTag()
    }

    /**
     * @description It will create Google Analytics script tag dynamically using tracking ID provided in configuration
     */
    private _setGoogleAnalyticsScriptTag(): void {
        const script: HTMLScriptElement = this.renderer.createElement('script')
        script.text = this._getScript()

        this.renderer.appendChild(this.document.body, script)

        this._startTracking()
    }

    private _getScript(): string {
        switch (this.config.trackingType) {
            case 'analytics':
                return `
                    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
                    ga('create', ${this.config.trackingId}, 'auto');
                    ga('send', 'pageview');
                `
            case 'gtm':
                return `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer', ${this.config.trackingId});
                `
            default:
                return `
                    window.dataLayer = window.dataLayer || [];function gtag() { dataLayer.push(arguments); }
                    gtag('js', new Date()); gtag('config', '${this.config.trackingId}');
                `
        }
    }

    /**
     * @description It initializes tracking by subscribing to router event. This will ensure that every route change
     * triggers method to send new page view event to Google Analytics
     */
    private _startTracking(): void {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => this.activatedRoute),
                map((route) => {
                    while (route.firstChild) {
                        route = route.firstChild
                    }

                    return route
                }),
                filter((route) => route.outlet === 'primary'),
                mergeMap((route) => route.data),
                delay(500)
            )
            .subscribe(() => {
                this._sendPageViewEvent()
            })
    }

    /**
     * @description It will check configuration and send pagehide event using appropriate syntax
     */
    private _sendPageViewEvent(): void {
        switch (this.config.trackingType) {
            case 'analytics':
                this._gaSend()
                break
            case 'gtm':
                this._dataLayerSend()
                break
            default:
                this._gtagSend()
                break
        }
    }

    /**
     * @description It will send page-view event using `gtag.js` syntax
     */
    private _gtagSend(): void {
        gtag('config', this.config.trackingId, {
            page_title: this.titleService.getTitle(),
            page_path: this.router.url,
        })
    }

    /**
     * @description It will send page-view event using `analytics.js` syntax
     */
    private _gaSend(): void {
        ga('set', 'page', this.router.url)
        ga('set', 'title', this.titleService.getTitle())
        ga('send', 'pageview')
    }

    /**
     * @description It will send page-view event using `gtm.js` syntax
     */
    private _dataLayerSend(): void {
        dataLayer.push({
            event: 'pageview',
            page: {
                title: this.titleService.getTitle(),
                path: this.router.url,
            },
        })
    }
}
