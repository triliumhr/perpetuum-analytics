import { Directive, Input, HostListener, inject } from '@angular/core'
import { IEventData } from './models/Analytics-config.model'
import { AnalyticsService } from './analytics.service'

@Directive({
    selector: '[perpetuumAnalytics]',
})
export class AnalyticsDirective {
    @Input({ required: true }) perpetuumAnalytics!: IEventData

    private analyticsService = inject(AnalyticsService)

    @HostListener('click') onClick() {
        this.analyticsService.sendEvent(this.perpetuumAnalytics)
    }
}
