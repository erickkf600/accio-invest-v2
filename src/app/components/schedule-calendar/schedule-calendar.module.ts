import { CommonModule, registerLocaleData } from '@angular/common'
import { NgModule } from '@angular/core'

import { ScheduleCalendarComponent } from '@components/schedule-calendar/schedule-calendar.component'
import { CalendarDateFormatter, CalendarModule, DateAdapter } from 'angular-calendar'
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'
import { CustomDateFormatter } from './custom-date.provider'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { ButtonModule } from 'primeng/button'
import { TagModule } from 'primeng/tag'
import localePt from '@angular/common/locales/pt'

registerLocaleData(localePt)
@NgModule({
  declarations: [ScheduleCalendarComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    TagModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
  exports: [ScheduleCalendarComponent],
})
export class ScheduleCalendarModule {}
