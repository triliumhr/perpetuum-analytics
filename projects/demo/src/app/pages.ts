import { Component } from '@angular/core'
import { TrackEvent } from '@triliumhr/perpetuum-analytics'

@Component({ template: '<h1>Welcome</h1>' })
export class Home {}

@Component({
    imports: [TrackEvent],
    template: `
        <h1>Kenya AA</h1>
        <button type="button" perpetuumTrack="add_to_cart" [perpetuumTrackParams]="{ currency: 'EUR', value: 12.5 }">Add to cart</button>
    `,
})
export class Shop {}
