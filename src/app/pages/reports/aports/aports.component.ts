import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { ReportsService } from '../services/reports.service'
import { Subscription } from 'rxjs'
import { MessageService } from 'primeng/api'
import { DialogService } from 'primeng/dynamicdialog'
import { DetailModalComponent } from './detail-modal/detail-modal.component'
import { Table } from 'primeng/table'
import { CurrencyPipe } from '@angular/common'
import { PdfGenService } from '@services/pdf-gen.service'

@Component({
  selector: 'app-aports',
  templateUrl: './aports.component.html',
  styleUrl: './aports.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AportsComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = []

  aportsHistoryContent: [] = []
  total: any
  constructor(
    private reportsService: ReportsService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private currencyPipe: CurrencyPipe,
    private pdfGenService: PdfGenService,
  ) {}
  ngOnInit(): void {
    this.getAports()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
  }
  getAports() {
    this.subscriptions.push(
      this.reportsService.getAportsHistory().subscribe({
        next: (res: any) => {
          this.aportsHistoryContent = res
          this.total = res.reduce((acc: any, el: any) => acc + +el.total_fees, 0)
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

  openDetail(content: any) {
    this.dialogService.open(DetailModalComponent, {
      data: content.items,
      header: `Ativos comprados em ${content.month}`,
      styleClass: 'details-modal',
    })
  }

  downloadPDF() {
    const tableHtml = this.buildTableHtml(this.aportsHistoryContent)
    this.pdfGenService.genPdf(tableHtml.replaceAll(',', ''))
  }

  buildTableHtml(data: any[]): string {
    return `
    <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:center;" cellspacing="0" cellpadding="4">
    <thead>
        <tr>
          <th style="border: solid 1px #ccc; color: #4b5563;">Mês</th>
          <th style="border: solid 1px #ccc; color: #4b5563;">Sub Total</th>
          <th style="border: solid 1px #ccc; color: #4b5563;">Taxas</th>
          <th style="border: solid 1px #ccc; color: #4b5563;">Total</th>
        </tr>
    </thead>
    <tbody>
        ${data.map(
          entry => `<tr>
              <td style="border-color: #ccc; background-color: #ebebeb">${entry.month}</td>
              <td style="border-color: #ccc; background-color: #ebebeb">${this.currencyPipe.transform(entry.value, 'BRL')}</td>
              <td style="border-color: #ccc; background-color: #ebebeb">${this.currencyPipe.transform(entry.fees, 'BRL')}</td>
              <td style="border-color: #ccc; background-color: #ebebeb">${this.currencyPipe.transform(entry.total_fees, 'BRL')}</td>
            </tr>
            <tr>
              <td colspan="4" style="width: 100%; border-color: #ccc">
              <table  style="width:100%; margin-top: -10px; margin-bottom: -9px; border-bottom: none; font-size:9px;" cellspacing="0" cellpadding="4">
                <thead>
                  <tr>
                    <th style="background-color: #454545; color: #fff; border: none">Cod</th>
                    <th style="background-color: #454545; color: #fff; border: none">Quantidade</th>
                    <th style="background-color: #454545; color: #fff; border: none">Taxa</th>
                    <th style="background-color: #454545; color: #fff; border: none">Total</th>
                  </tr>
                </thead>
                <tbody>
                ${entry.items.map(
                  (sub: any) => `
                    <tr>
                      <td style="border-color: #ededed; border-right: none; font-size: 10px">${sub.asset}</td>
                      <td style="border-color: #ededed; border-right: none; border-left: none; font-size: 10px">${sub.qtd}</td>
                      <td style="border-color: #ededed; border-left: none; border-right: none; font-size: 10px">${this.currencyPipe.transform(sub.fee, 'BRL')}</td>
                      <td style="border-left: none; border-color: #ededed; font-size: 10px">${this.currencyPipe.transform(sub.value, 'BRL')}</td>
                    </tr>`,
                )}
                </tbody>
              </table>
              </td>
            </tr>
          `,
        )}
    </tbody>
  </table>`
  }
}
