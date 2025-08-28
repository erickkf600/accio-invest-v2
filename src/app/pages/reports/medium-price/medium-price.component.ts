import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Subscription, of } from 'rxjs'
import { ReportsService } from '../services/reports.service'
import { MessageService } from 'primeng/api'
import { CurrencyPipe } from '@angular/common'
import { PdfGenService } from '@services/pdf-gen.service'
import { Table } from 'primeng/table'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { WalletService } from '../../wallet/service/wallet.service'

@Component({
  selector: 'app-medium-price',
  templateUrl: './medium-price.component.html',
  styleUrl: './medium-price.component.scss',
})
export class MediumPriceComponent implements OnInit, OnDestroy {
  @ViewChild('table') table: Table
  public subscriptions: Subscription[] = []
  public filterFormGroup: FormGroup = new FormGroup({
    cod: new FormControl(''),
    period: new FormControl('', Validators.required),
  })
  pMHistoryContent: [] = []
  total: any
  selectedPeriod: Date[] = []
  assetsList: string[] = []
  constructor(
    private reportsService: ReportsService,
    private messageService: MessageService,
    private currencyPipe: CurrencyPipe,
    private pdfGenService: PdfGenService,
    private walletService: WalletService,
  ) {}

  get buttonDisabled() {
    return !(
      this.filterFormGroup.get('period')?.value?.length === 2 &&
      this.filterFormGroup.get('period')?.value.every((item: any) => item !== null)
    )
  }

  ngOnInit(): void {
    this.getPm()
    this.subscriptions.push(
      this.walletService
        .getAssetsList()
        .subscribe(res => (this.assetsList = res.map(el => el.cod))),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  onGlobalFilter(event: Event) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
  }

  getPm(period: string[] = [], cod: string | null = '', clearCache = false, loading = true) {
    const payload: any = {
      cod: cod,
      period: period.length === 2 ? period : this.defaultPeriod(),
    }
    this.subscriptions.push(
      this.reportsService.getPmHistory(payload, clearCache, loading).subscribe({
        next: (res: any) => {
          this.pMHistoryContent = res
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

  sendFilter() {
    const period = this.filterFormGroup.value.period.map((d: any) => {
      const date = new Date(d)
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const year = date.getUTCFullYear()
      return `${month}-${year}`
    })
    this.getPm(period, this.filterFormGroup.value.cod, true, false)
  }

  clearFilter() {
    this.filterFormGroup.reset()
    this.getPm(this.defaultPeriod(), '', true, false)
  }

  downloadPDF() {
    const tableHtml = this.buildTableHtml(this.pMHistoryContent)
    this.pdfGenService.genPdf(tableHtml.replaceAll(',', ''))
  }

  private buildTableHtml(data: any[]): string {
    return `
    <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:center;" cellspacing="0" cellpadding="4">
    <thead>
        <tr>
          <th style="border: solid 1px #ccc; color: #4b5563;">Cod</th>
          <th style="border: solid 1px #ccc; color: #4b5563;">Quantidade</th>
          <th style="border: solid 1px #ccc; color: #4b5563;">Preço médio</th>
          <th style="border: solid 1px #ccc; color: #4b5563;">Total Investido</th>
        </tr>
    </thead>
    <tbody>
        ${data.map(
          entry => `<tr>
              <td style="border-color: #ccc">${entry.cod}</td>
              <td style="border-color: #ccc">${entry.qtd}</td>
              <td style="border-color: #ccc">${this.currencyPipe.transform(entry.medium_price, 'BRL')}</td>
              <td style="border-color: #ccc">${this.currencyPipe.transform(entry.total, 'BRL')}</td>
            </tr>
          `,
        )}
    </tbody>
  </table>`
  }

  private defaultPeriod() {
    const data = new Date()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = data.getFullYear()
    const defaultPeriod = [`${mes}-${ano}`, `${mes}-${ano}`]
    return defaultPeriod
  }
}
