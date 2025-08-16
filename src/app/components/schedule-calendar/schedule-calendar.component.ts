import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { NavigationExtras, Router } from '@angular/router'
import { CalendarEvent } from 'angular-calendar'
import { format } from 'date-fns'
import { OverlayPanel } from 'primeng/overlaypanel'
import { Subscription } from 'rxjs'

export interface WeekDay {
  date: Date
  day: number
  isPast: boolean
  isToday: boolean
  isFuture: boolean
  isWeekend: boolean
  cssClass?: string
  events: CalendarEvent[]
}

@Component({
  selector: 'schedule-calendar',
  templateUrl: './schedule-calendar.component.html',
  styleUrl: './schedule-calendar.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ScheduleCalendarComponent implements OnInit, OnDestroy {
  viewDate: Date = new Date()
  locale = 'pt'
  selectedDate: string
  selectedContent: CalendarEvent[]
  private subscriptions: Subscription[] = []

  @ViewChild('op') overlayPanel: OverlayPanel

  @Input() events: CalendarEvent[] = []

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  clickEvent(ev: Event, data: WeekDay) {
    this.selectedDate = format(data.date, 'MM-dd-yyyy')
    if (data.events.length) {
      if (this.overlayPanel.overlayVisible) {
        this.overlayPanel.hide()
        setTimeout(() => {
          this.overlayPanel.show(ev)
        }, 100)
      } else {
        this.overlayPanel.show(ev)
      }
      this.selectedContent = data.events.flatMap(item => item.meta)
      console.log(this.selectedContent)
    }
  }

  formatDate(date: Date): string {
    return format(date, 'MM-dd-yyyy')
  }

  openDetail(id: number) {
    const navigationExtras: NavigationExtras = {
      state: { from: 'dashboard', id: id },
    }
    this.router.navigate(['schedules'], navigationExtras)
  }
}
