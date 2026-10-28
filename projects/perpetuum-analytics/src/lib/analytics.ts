import { DOCUMENT, Location, isPlatformBrowser } from '@angular/common'
import { CSP_NONCE, DestroyRef, Injectable, PLATFORM_ID, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs'

import { ANALYTICS_CONFIG, ConsentState, EventParams } from './analytics-config'
import { GoogleTag, installGoogleTag } from './google-tag'

/** Sends what happens in the app to Google: page views on its own, events when asked. */
@Injectable({ providedIn: 'root' })
export class Analytics {
    private readonly config = inject(ANALYTICS_CONFIG)
    private readonly document = inject(DOCUMENT)
    private readonly nonce = inject(CSP_NONCE, { optional: true })
    private readonly inBrowser = isPlatformBrowser(inject(PLATFORM_ID))
    private readonly router = inject(Router)
    private readonly location = inject(Location)
    private readonly destroyRef = inject(DestroyRef)
    private googleTag: GoogleTag | null = null

    /**
     * Loads the tag and starts page views. provideAnalytics() calls it when the app starts;
     * with `start: 'manual'` the app calls it, for example once the visitor agrees. Calling it again does nothing.
     */
    start(): void {
        if (!this.inBrowser || this.googleTag) return

        this.googleTag = installGoogleTag(this.document, this.config, this.nonce)
        this.sendPageViewAfterEachNavigation()
        // A late start finds the visitor already on a page, and that page would otherwise never be counted.
        if (this.router.navigated) this.sendPageView()
    }

    /** Sends a custom event, such as `add_to_cart` or `sign_up`. */
    event(name: string, params: EventParams = {}): void {
        this.googleTag?.event(name, params)
    }

    /** Passes the visitor's consent choice on to Google, for example from the app's own cookie banner. */
    updateConsent(choices: ConsentState): void {
        this.googleTag?.updateConsent(choices)
    }

    private sendPageViewAfterEachNavigation(): void {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef)
            )
            // The router sets the route's title right after NavigationEnd, so the page view waits for that turn to finish.
            .subscribe(() => queueMicrotask(() => this.sendPageView()))
    }

    private sendPageView(): void {
        const address = new URL(this.location.prepareExternalUrl(this.router.url), this.document.location.origin)
        this.googleTag?.pageView({ page_location: address.href, page_title: this.document.title })
    }
}
