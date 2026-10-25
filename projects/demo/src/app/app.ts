import { Component, inject } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'
import { Analytics } from '@triliumhr/perpetuum-analytics'

@Component({
    imports: [RouterOutlet, RouterLink],
    selector: 'app-root',
    template: `
        <nav>
            <a routerLink="/">Home</a>
            <a routerLink="/shop">Shop</a>
        </nav>
        <section aria-label="Cookie choice">
            <button type="button" (click)="allowStatistics()">Allow statistics</button>
        </section>
        <router-outlet />
    `,
})
export class App {
    private readonly analytics = inject(Analytics)

    protected allowStatistics(): void {
        this.analytics.updateConsent({ analytics_storage: 'granted' })
    }
}
