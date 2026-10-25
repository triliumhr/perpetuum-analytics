import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'

import { provideAnalytics } from './provide-analytics'
import { gtagCommands, forgetGoogle } from './testing/google-globals'
import { TrackEvent } from './track-event'

@Component({
    imports: [TrackEvent],
    template: `
        <button perpetuumTrack="add_to_cart" [perpetuumTrackParams]="{ currency: 'EUR', value: 12.5 }">Add to cart</button>
        <a href="#" perpetuumTrack="sign_up">Sign up</a>
    `,
})
class Shop {}

function render(): HTMLElement {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideAnalytics({ tag: 'gtag', measurementId: 'G-TEST' })] })
    const fixture = TestBed.createComponent(Shop)
    fixture.detectChanges()
    return fixture.nativeElement
}

function events(): unknown[][] {
    return gtagCommands('event').filter((command) => command[1] !== 'page_view')
}

describe('perpetuumTrack', () => {
    afterEach(() => forgetGoogle())

    it('sends its event with the parameters when the element is clicked', () => {
        const page = render()

        page.querySelector('button')?.click()

        expect(events()).toEqual([['event', 'add_to_cart', { currency: 'EUR', value: 12.5 }]])
    })

    it('sends an event without parameters when none are given', () => {
        const page = render()

        page.querySelector('a')?.click()

        expect(events()).toEqual([['event', 'sign_up', {}]])
    })

    it('sends nothing until the element is clicked', () => {
        render()

        expect(events()).toEqual([])
    })
})
