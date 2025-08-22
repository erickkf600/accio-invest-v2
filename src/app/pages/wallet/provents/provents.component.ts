import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { MONTH_NAMES_SHORT } from '@mocks/monthNames'
import { Subscription, finalize } from 'rxjs'
import { WalletService } from '../service/wallet.service'
import { MessageService } from 'primeng/api'
import _, { concat } from 'lodash'

@Component({
  selector: 'app-provents',
  templateUrl: './provents.component.html',
  styleUrl: './provents.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProventsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = []
  public rentLoading = true
  public chartComOptions: any
  public chartAportsOptions: any
  proventsList: any[] = []
  public composition: any[] = []
  monthNames = MONTH_NAMES_SHORT
  constructor(
    public walletService: WalletService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.walletRent()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  private walletRent() {
    this.subscriptions.push(
      this.walletService
        .getRentability()
        .pipe(finalize(() => (this.rentLoading = false)))
        .subscribe({
          next: (res: any) => {
            this.composition = res.composition
            this.createDonutChart()
            this.createColumnChart(res)
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
  private createDonutChart() {
    this.chartComOptions = {
      series: this.composition.map(item => item.total),
      chart: {
        type: 'donut',
        id: 'rentabilityChart',
        redrawOnParentResize: false,
        redrawOnWindowResize: false,
      },
      labels: this.composition.map(item => item.type),
      colors: this.composition.map(item => item.hex),
      legend: { show: false },
      dataLabels: { enabled: false },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val: number) => val.toLocaleString('pt-BR'),
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: { chart: { width: 320 } },
        },
      ],
    }
  }

  private createColumnChart(content: any) {
    const merged = concat(
      content.payed.map((i: any) => ({ ...i, status: 'payed' })),
      content.expected.map((i: any) => ({ ...i, status: 'expected' })),
    )
    const grouped = _(merged)
      .groupBy(i => `${i.month_ref}-${i.year}`)
      .map((items, key) => ({
        month_ref: items[0].month_ref,
        year: items[0].year,
        month_name: this.monthNames[items[0].month_ref - 1],
        total: parseFloat(_.sumBy(items, 'total').toFixed(2)),
        items,
      }))
      .value()

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
        events: {
          dataPointSelection: (_event: any, _chartContext: any, config: any) => {
            const { dataPointIndex } = config
            this.proventsList = grouped[dataPointIndex].items
          },
        },
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
          name: 'Valor',
          data: grouped.map((el: any) => el.total),
          color: '#051965',
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
        categories: grouped.map((el: any) => el.month_name),
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
}
