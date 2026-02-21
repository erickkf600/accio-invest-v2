import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { MONTH_NAMES_SHORT } from '@mocks/monthNames'
import { Subscription, finalize } from 'rxjs'
import { WalletService } from '../service/wallet.service'
import { ConfirmationService, MessageService } from 'primeng/api'
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
  selectedProvents: any[] = []
  savingLoader = false

  yearsList: { label: number; value: number }[] = []
  selectedYear = new Date().getFullYear()
  constructor(
    public walletService: WalletService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.walletRent(this.selectedYear)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  private walletRent(year: number) {
    this.subscriptions.push(
      this.walletService
        .getRentability(year)
        .pipe(finalize(() => (this.rentLoading = false)))
        .subscribe({
          next: (res: any) => {
            this.composition = res.composition
            this.createDonutChart()
            this.createColumnChart(res)

            this.yearsList = Array.from(
              { length: new Date().getFullYear() - res.startYear + 1 },
              (_, index) => {
                const year = res.startYear + index
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
    const grouped = _(content.earnings)
      .groupBy(i => `${i.month_ref}-${i.year}`)
      .map((items, key) => {
        const filteredItems = items.filter(item => item.qtdAtDate > 0)
        return {
          month_ref: items[0].month_ref,
          year: items[0].year,
          month_name: this.monthNames[items[0].month_ref - 1],
          total: parseFloat(_.sumBy(filteredItems, 'totalReceived').toFixed(2)),
          items: filteredItems,
        }
      })
      .orderBy(['year', 'month_ref'], ['asc', 'asc'])
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
          dataPointSelection: (_event: any, chartContext: any, config: any) => {
            const { dataPointIndex, seriesIndex } = config
            const value = chartContext.w.globals.series[seriesIndex][dataPointIndex]
            if (value) {
              this.proventsList = grouped[dataPointIndex].items.map((p, i) => ({
                id: p.month_ref + p.cod + i + p.payment_date.replace(' ', '').replace('/', ''),
                ...p,
              }))
            } else {
              this.proventsList = []
            }
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

  setYear() {
    this.walletRent(this.selectedYear)
    this.proventsList = []
  }

  registerProvents(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Tem certeza que deseja cadastrar?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-contrast',
      rejectButtonStyleClass: 'p-button-outlined p-button-contrast',
      accept: () => {
        const payload = this.selectedProvents.map(el => ({
          cod: el.cod,
          date_operation: el.payment_date,
          qtd: el.qtdAtDate,
          type_operation: 3,
          type: el.type.id,
          unity_value: el.value,
          fee: 0,
          obs: '',
          total: el.totalReceived,
        }))
        this.savingLoader = true
        this.subscriptions.push(
          this.walletService
            .saveProvent(payload)
            .pipe(finalize(() => (this.savingLoader = false)))
            .subscribe({
              next: () => {
                this.selectedProvents = []
                this.walletRent(this.selectedYear)
                this.messageService.add({
                  severity: 'success',
                  summary: 'Sucesso',
                  detail: 'Dividendo cadastrado',
                })
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
      },
      reject: () => {
        this.confirmationService.close()
      },
    })
  }
}
