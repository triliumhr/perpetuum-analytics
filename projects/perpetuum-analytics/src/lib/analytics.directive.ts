import { Directive, Input, HostListener } from '@angular/core'
import { IEventData } from './models/Analytics-config.model'
import { AnalyticsService } from './analytics.service'

@Directive({
    selector: '[perpetuumAnalytics]',
})
export class AnalyticsDirective {
    @Input({ required: true }) perpetuumAnalytics!: IEventData

    @HostListener('click') onClick() {
        this.analyticsService.sendEvent(this.perpetuumAnalytics)
    }

    constructor(private analyticsService: AnalyticsService) {}
}
