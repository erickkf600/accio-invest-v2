import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { ReportsService } from '../services/reports.service'
import { Subscription } from 'rxjs'
import { MessageService } from 'primeng/api'
import { DialogService } from 'primeng/dynamicdialog'
import { DetailModalComponent } from './detail-modal/detail-modal.component'
import { Table } from 'primeng/table'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import htmlToPdfmake from 'html-to-pdfmake'
import { CurrencyPipe } from '@angular/common'
pdfMake.vfs = pdfFonts.vfs

@Component({
  selector: 'app-aports',
  templateUrl: './aports.component.html',
  styleUrl: './aports.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AportsComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = []

  aportsHistoryContent: [] = []
  constructor(
    private reportsService: ReportsService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private currencyPipe: CurrencyPipe,
  ) {}
  ngOnInit(): void {
    this.getAports()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
  getAports() {
    this.subscriptions.push(
      this.reportsService.getAportsHistory().subscribe({
        next: (res: any) => {
          this.aportsHistoryContent = res
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
    // const converted = htmlToPdfmake(table.containerViewChild?.nativeElement)
    // const docDefinition = { content: converted }
    // pdfMake.createPdf(docDefinition).download('document.pdf')

    // cria a tabela
    const tableHtml = this.buildTableHtml(this.aportsHistoryContent)
    const converted = htmlToPdfmake(tableHtml, { tableAutoSize: true })
    const docDefinition = { content: converted }
    pdfMake.createPdf(docDefinition).open()
  }

  // todo rever por que esta criando , nas tables
  buildTableHtml(data: any[]): string {
    return `
    <table style="width: 100%">
    <thead>
        <tr>
          <th>Mês</th>
          <th>Sub Total</th>
          <th>Taxas</th>
          <th>Total</th>
        </tr>
    </thead>
    <tbody>
        ${data.map(
          entry => `<tr>
              <td>${entry.month}</td>
              <td>${this.currencyPipe.transform(entry.value, 'BRL')}</td>
              <td>${this.currencyPipe.transform(entry.fees, 'BRL')}</td>
              <td>${this.currencyPipe.transform(entry.total_fees, 'BRL')}</td>
            </tr>
            <tr>
              <td colspan="5">
              <table  style="width: 83%">
                <thead>
                  <tr>
                    <th>Cod</th>
                    <th>Quantidade</th>
                    <th>Taxa</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                ${entry.items.map(
                  (sub: any) => `
                    <tr>
                      <td>${sub.asset}</td>
                      <td>${sub.qtd}</td>
                      <td>${this.currencyPipe.transform(sub.fee, 'BRL')}</td>
                      <td>${this.currencyPipe.transform(sub.value, 'BRL')}</td>
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
