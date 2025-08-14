import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { HomeRoutingModule } from './home-routing.module'
import { HomeComponent } from './home.component'
import { NgApexchartsModule } from 'ng-apexcharts'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'
import { ScheduleCalendarModule } from '@components/schedule-calendar/schedule-calendar.module'

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgApexchartsModule,
    DropdownModule,
    FormsModule,
    ScheduleCalendarModule,
  ],
})
export class HomeModule {}
