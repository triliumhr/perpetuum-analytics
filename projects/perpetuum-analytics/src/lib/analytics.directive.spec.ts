import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'

import { AnalyticsModule } from './analytics.module'
import { AnalyticsService } from './analytics.service'
import { IEventData } from './models/Analytics-config.model'

const addToCart: IEventData = { eventCategory: 'Cart', eventAction: 'add_to_cart', eventLabel: 'Kenya AA', eventValue: 12 }

@Component({
    imports: [AnalyticsModule],
    template: `<button type="button" [perpetuumAnalytics]="event">Add to cart</button>`,
})
class CartButton {
    event = addToCart
}

describe('perpetuumAnalytics directive', () => {
    it('sends its event when the element is clicked', () => {
        const sendEvent = vi.fn()
        TestBed.configureTestingModule({
            providers: [{ provide: 'gaConfig', useValue: { trackingId: 'G-TEST123', trackingType: 'gtag' } }],
        })
        TestBed.overrideProvider(AnalyticsService, { useValue: { sendEvent } })
        const fixture = TestBed.createComponent(CartButton)
        fixture.detectChanges()

        fixture.nativeElement.querySelector('button').click()

        expect(sendEvent).toHaveBeenCalledWith(addToCart)
    })
})

describe('AnalyticsModule.forRoot', () => {
    afterEach(() => vi.unstubAllGlobals())

    it('hands the configuration to the analytics service', () => {
        const gtag = vi.fn()
        vi.stubGlobal('gtag', gtag)
        TestBed.configureTestingModule({
            imports: [AnalyticsModule.forRoot({ trackingId: 'G-TEST123', trackingType: 'gtag' })],
            providers: [provideRouter([])],
        })

        TestBed.inject(AnalyticsService).sendEvent(addToCart)

        expect(gtag).toHaveBeenCalledWith('event', 'add_to_cart', expect.anything())
    })
})
