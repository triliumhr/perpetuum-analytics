import { Component, NgModule, provideZonelessChangeDetection } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Router, provideRouter } from '@angular/router'

import { provideAnalytics } from './provide-analytics'
import { gtagCommands, forgetGoogle } from './testing/google-globals'
import { TrackEvent } from './track-event'

// The point of this spec is an app built from NgModules, so the component opts out of standalone on purpose.
// eslint-disable-next-line @angular-eslint/prefer-standalone
@Component({ standalone: false, template: '<button perpetuumTrack="sign_up">Sign up</button>' })
class SignUp {}

@NgModule({
    declarations: [SignUp],
    imports: [TrackEvent],
    providers: [
        provideRouter([{ path: 'sign-up', component: SignUp, title: 'Sign up' }]),
        provideAnalytics({ tag: 'gtag', measurementId: 'G-TEST123' }),
    ],
})
class AppModule {}

function pageViews(): unknown[][] {
    return gtagCommands('event').filter((command) => command[1] === 'page_view')
}

describe('Angular setups', () => {
    afterEach(() => forgetGoogle())

    it('works in an NgModule app: page views from the provider, events from the directive', async () => {
        TestBed.configureTestingModule({ imports: [AppModule] })
        await TestBed.inject(Router).navigateByUrl('/sign-up')
        await Promise.resolve()
        const fixture = TestBed.createComponent(SignUp)
        fixture.detectChanges()

        fixture.nativeElement.querySelector('button').click()

        expect(pageViews()).toHaveLength(1)
        expect(gtagCommands('event').at(-1)).toEqual(['event', 'sign_up', {}])
    })

    it('works in a zoneless app', async () => {
        TestBed.configureTestingModule({
            providers: [
                provideZonelessChangeDetection(),
                provideRouter([{ path: 'sign-up', component: SignUp, title: 'Sign up' }]),
                provideAnalytics({ tag: 'gtag', measurementId: 'G-TEST123' }),
            ],
        })

        await TestBed.inject(Router).navigateByUrl('/sign-up')
        await Promise.resolve()

        expect(pageViews()).toEqual([['event', 'page_view', { page_location: 'http://localhost:3000/sign-up', page_title: 'Sign up' }]])
    })
})
