import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { MONTH_NAMES_SHORT } from '@mocks/monthNames'
import _, { concat } from 'lodash'
import { MessageService } from 'primeng/api'
import { Subscription, finalize, forkJoin } from 'rxjs'
import { WalletService } from '../service/wallet.service'

@Component({
  selector: 'app-rentability',
  templateUrl: './rentability.component.html',
  styleUrl: './rentability.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class RentabilityComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = []
  public rentLoading = true
  public chartAportsOptions: any
  public composition: any[] = []
  monthNames = MONTH_NAMES_SHORT
  patrimonyRent: any[] = []
  variationList: any[] = []
  dividendList: any[] = []

  yearsList: { label: number; value: number }[] = []
  monthFilterContent: { label: number; value: number }[] = []
  selectedYear = new Date().getFullYear()
  solidColor1 = '#00034d'
  solidColor2 = '#1c1c1c'
  constructor(
    public walletService: WalletService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.pageContent()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  private pageContent() {
    this.subscriptions.push(
      forkJoin({
        patrimonyGain: this.walletService.getPatrimonyGain(),
        variations: this.walletService.getVariations(),
        dividends: this.walletService.geDividendsComparison(this.selectedYear),
      })
        .pipe(finalize(() => (this.rentLoading = false)))
        .subscribe({
          next: (res: any) => {
            this.patrimonyRent = res.patrimonyGain.reverse()
            this.variationList = res.variations
            this.dividendList = res.dividends.content
            this.createColumnChart(res.dividends.content)
            this.monthFilterContent = this.patrimonyRent.map(el => ({
              label: el.month,
              value: el.month,
            }))
            this.yearsList = Array.from(
              { length: new Date().getFullYear() - res.dividends.startYear + 1 },
              (_, index) => {
                const year = res.dividends.startYear + index
                return { label: year, value: year }
              },
            )
          },
          error: err => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err?.error?.message,
            })
          },
        }),
    )
  }
  private createColumnChart(content: any) {
    this.chartAportsOptions = {
      chart: {
        type: 'bar',
        height: 300,
        with: '100%',
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
        parentHeightOffset: 0,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '40%',
          endingShape: 'rounded',
        },
      },
      series: [
        {
          name: 'Ano anterior',
          data: content[0].map((el: any) => el.valor),
          color: this.solidColor2,
        },
        {
          name: 'Ano atual',
          data: content[1].map((el: any) => el.valor),
          color: this.solidColor1,
        },
      ],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: this.monthNames,
        labels: { style: { colors: '#607D8B' } },
      },
      yaxis: {
        labels: { style: { colors: '#90A4AE' } },
      },
      grid: { strokeDashArray: 3, borderColor: '#ccc' },
      markers: { show: false },
      legend: { show: false },
    }
  }

  setYear() {
    this.subscriptions.push(
      this.walletService.geDividendsComparison(this.selectedYear).subscribe({
        next: (res: any) => {
          this.createColumnChart(res.content)
        },
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message,
          })
        },
      }),
    )
  }
}
