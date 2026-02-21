import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { Subscription } from 'rxjs'
import { ReportsService } from '../services/reports.service'
import { MessageService } from 'primeng/api'
import { DialogService } from 'primeng/dynamicdialog'
import { CurrencyPipe } from '@angular/common'
import { Table } from 'primeng/table'
import { PdfGenService } from '@services/pdf-gen.service'

@Component({
  selector: 'recived-rent',
  templateUrl: './recived-rent.component.html',
  styleUrl: './recived-rent.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class RecivedRentComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = []
  total: any
  rentHistoryContent: [] = []
  constructor(
    private reportsService: ReportsService,
    private messageService: MessageService,
    private currencyPipe: CurrencyPipe,
    private pdfGenService: PdfGenService,
  ) {}
  ngOnInit(): void {
    this.getRent()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
  }
  getRent() {
    this.subscriptions.push(
      this.reportsService.getRentHistory().subscribe({
        next: (res: any) => {
          this.rentHistoryContent = res
          this.total = res.reduce((acc: any, el: any) => acc + el.total, 0)
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
    const tableHtml = this.buildTableHtml(this.rentHistoryContent)
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
