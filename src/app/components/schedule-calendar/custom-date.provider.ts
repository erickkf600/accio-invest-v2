import { formatDate } from '@angular/common'
import { Injectable } from '@angular/core'
import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar'

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
  public override monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'EEE', locale || '')
      .replace('.', '')
      .toLowerCase()
  }
}
