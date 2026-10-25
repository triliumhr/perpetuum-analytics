import { Directive, inject, input } from '@angular/core'

import { Analytics } from './analytics'
import { EventParams } from './analytics-config'

/** Sends a custom event when the element is clicked: `<button perpetuumTrack="add_to_cart">`. */
@Directive({
    selector: '[perpetuumTrack]',
    host: { '(click)': 'send()' },
})
export class TrackEvent {
    readonly perpetuumTrack = input.required<string>()
    readonly perpetuumTrackParams = input<EventParams>({})

    private readonly analytics = inject(Analytics)

    protected send(): void {
        this.analytics.event(this.perpetuumTrack(), this.perpetuumTrackParams())
    }
}
