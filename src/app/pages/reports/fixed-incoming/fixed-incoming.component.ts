import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { ReportsService } from '../services/reports.service'
import { MessageService } from 'primeng/api'
import { CurrencyPipe } from '@angular/common'
import { PdfGenService } from '@services/pdf-gen.service'
import { Table } from 'primeng/table'
import { INVEST_TYPES } from '@mocks/investTypes'
import { TITLE_TYPES } from '@mocks/titleTypes'
import { FORM_TYPES } from '@mocks/formTypes'
import { INDEX_TYPES } from '@mocks/indexTypes'

@Component({
  selector: 'fixed-incoming',
  templateUrl: './fixed-incoming.component.html',
  styleUrl: './fixed-incoming.component.scss',
})
export class FixedIncomingComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = []

  rfHistoryContent: [] = []
  investTypes = INVEST_TYPES
  titleTypes = TITLE_TYPES
  formTypes = FORM_TYPES
  indexTypes = INDEX_TYPES
  total: any
  constructor(
    private reportsService: ReportsService,
    private messageService: MessageService,
    private currencyPipe: CurrencyPipe,
    private pdfGenService: PdfGenService,
  ) {}
  ngOnInit(): void {
    this.getSell()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
  }
  getSell() {
    this.subscriptions.push(
      this.reportsService.getRfHistory().subscribe({
        next: (res: any) => {
          this.rfHistoryContent = res
          this.total = res.reduce((acc: any, el: any) => acc + +el.total, 0)
        },
        error: error => {
          console.error(error)
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocorreu um erro',
          })
        },
      }),
    )
  }

  downloadPDF() {
    const tableHtml = this.buildTableHtml(this.rfHistoryContent)
    this.pdfGenService.genPdf(tableHtml.replaceAll(',', ''))
  }

  buildTableHtml(data: any[]): string {
    return `
    <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:center;" cellspacing="0" cellpadding="4">
    <thead>
        <tr>
          <th style="border: solid 1px #ccc; color: #4b5563;">Cod</th>
          <th style="border: solid 1px #ccc; color: #4b5563;">Data</th>
          <th style="border: solid 1px #ccc; color: #4b5563;">Tipo</th>
          <th style="border: solid 1px #ccc; color: #4b5563;">Valor</th>
        </tr>
    </thead>
    <tbody>
        ${data.map(
          entry => `<tr>
              <td style="border-color: #ccc">${entry.cod}</td>
              <td style="border-color: #ccc">${entry.date_operation}</td>
              <td style="border-color: #ccc">${entry.assetsType.full_title}</td>
              <td style="border-color: #ccc">${this.currencyPipe.transform(entry.total, 'BRL')}</td>
            </tr>
          `,
        )}
    </tbody>
  </table>`
  }
}
