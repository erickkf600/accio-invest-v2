import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { ChartComponent } from 'ng-apexcharts'
import { MessageService } from 'primeng/api'
import { Subscription, finalize } from 'rxjs'
import { Resume, resume } from './interface/resume.interface'
import { HomeService } from './service/home.service'
import { CalendarEvent } from 'angular-calendar'
import { addHours, endOfMonth, format, parseISO, startOfDay, startOfMonth } from 'date-fns'
import { MONTH_NAMES_SHORT } from '@mocks/monthNames'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
  cardsContent: any[] = []
  @ViewChild('chart') chart!: ChartComponent
  public chartDistOptions: any
  public chartAlocationsOptions: any
  public chartCDIOptions: any
  public chartAportsOptions: any
  public chartEvolutionOptions: any
  public loading = true
  public loadingCDI = true
  public loadingAports = true
  public loadingEvolution = true
  public evolutionList: { total: string; label: string | string }[] = []
  private subscriptions: Subscription[] = []
  yearsList: { label: number; value: number }[] = []
  evolutionType: { label: string; value: string }[] = [
    {
      label: 'Ano',
      value: 'year',
    },
    {
      label: 'Mês',
      value: 'month',
    },
  ]
  selectedEvolutionType: 'year' | 'month' = 'year'
  selectedCDiYear = new Date().getFullYear()
  selectedAportsYear = new Date().getFullYear()
  nextPayments: CalendarEvent[] = [
    {
      start: addHours(startOfDay(new Date()), 14),
      title: `Dividendos`,
      meta: {
        cod: [
          {
            tag: 'MXRF11',
            value: 0.5,
          },
          {
            tag: 'HGLG11',
            value: 2.0,
          },
        ],
      },
    },
  ]

  solidColor1 = '#00034d'
  solidColor2 = '#1c1c1c'
  monthNames = MONTH_NAMES_SHORT
  comparisonType = [
    {
      label: 'Preço de compra',
      value: 'preco_compra',
    },
    {
      label: 'Preço médio',
      value: 'preco_medio',
    },
  ]
  comparisonSelected = 'preco_compra'
  cdiComparisonContent: any[] = []

  constructor(
    private homeService: HomeService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.displayResume()
    this.populateCdiChart(this.selectedCDiYear)
    this.populateAportsChart(this.selectedAportsYear)
    this.getEvolutionOfPatrimony(this.selectedEvolutionType)
    this.populateSchedule()
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
  displayResume() {
    this.subscriptions.push(
      this.homeService
        .getResumeData()
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (res: resume) => {
            this.createCards(res.resume)
            res.alocations?.forEach(el => (el.title = el.type))
            this.chartAlocationsOptions = this.createDonutChart(res.alocations as any)
            this.chartDistOptions = this.createDonutChart(res.distribuition as any)
            this.yearsList = Array.from(
              { length: new Date().getFullYear() - res.resume.startYear + 1 },
              (_, index) => {
                const year = res.resume.startYear + index
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

  populateCdiChart(year: number) {
    this.subscriptions.push(
      this.homeService
        .getCDIComparation(year)
        .pipe(finalize(() => (this.loadingCDI = false)))
        .subscribe({
          next: (res: any) => {
            this.creatingCDIChart(res)
            this.cdiComparisonContent = res
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

  populateAportsChart(year: number) {
    this.subscriptions.push(
      this.homeService
        .getAportsList(year)
        .pipe(finalize(() => (this.loadingAports = false)))
        .subscribe({
          next: (res: any) => {
            this.createAportChart(res)
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

  populateSchedule() {
    const today = new Date()
    const dataInicio = format(startOfMonth(today), 'yyyy-MM-dd')
    const dataFim = format(endOfMonth(today), 'yyyy-MM-dd')
    this.subscriptions.push(
      this.homeService.getEarningSchedule({ dataInicio, dataFim }).subscribe({
        next: (res: any) => {
          this.nextPayments = res.map((el: any) => {
            const date = parseISO(el.payment_date)

            return {
              start: date,
              meta: el.dividends,
            }
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
  }

  private createCards(resume: Resume) {
    this.cardsContent = [
      {
        title: 'Total investido',
        value: resume.total,
        icon: 'pi-chart-pie',
        iconColor: 'blue',
      },
      {
        title: 'Último aporte',
        value: resume.last,
        icon: 'pi-chart-line',
        iconColor: 'orange',
      },
      {
        title: 'Último pagamento',
        value: resume.last_dividend,
        icon: 'pi-history',
        iconColor: 'cyan',
      },
      {
        title: 'Patrimônio',
        value: resume.patrimony,
        icon: 'pi-dollar',
        iconColor: 'purple',
        help: 'Valor referente a cotação atual',
      },
    ]
  }

  private createDonutChart(content: any[]) {
    return {
      series: content.map(item => item.qtd),
      chart: { type: 'donut' },
      labels: content.map(item => item.title),
      colors: content.map(item => item.hex),
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

  private createAportChart(content: any[]) {
    // const categories = content.map(item => item[0].label)
    // const values = content.map(item => item[0].valor)

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
          columnWidth: '55%',
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
      grid: { strokeDashArray: 4, borderColor: '#ccc' },
      markers: { show: false },
      legend: { show: false },
    }
  }

  creatingCDIChart(content: any[]) {
    this.chartCDIOptions = {
      series: [
        {
          name: 'CDI',
          data: content[0].map((d: any) => d.valor),
          color: this.solidColor1,
        },
        {
          name: 'Carteira',
          data: content[1].map((d: any) => d[this.comparisonSelected]),
          color: this.solidColor2,
        },
      ],
      chart: {
        type: 'area',
        height: 350,
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      xaxis: {
        categories: this.monthNames,
        labels: { style: { colors: '#607D8B' } },
      },
      yaxis: {
        labels: { style: { colors: '#90A4AE' } },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: [this.solidColor1, this.solidColor2],
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 1,
          gradientToColors: [this.solidColor1, this.solidColor2],
          opacityFrom: 0.7,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      markers: { show: false },
      grid: { strokeDashArray: 4, borderColor: '#ccc' },
      tooltip: {
        shared: true,
        followCursor: true,
      },
      legend: { show: false },
    }
  }

  setChartCDIYear() {
    this.populateCdiChart(this.selectedCDiYear)
  }

  setCharCDIComparison(chart: ChartComponent) {
    chart.updateSeries(
      [
        { data: this.cdiComparisonContent[0].map((d: any) => d.valor) },
        { data: this.cdiComparisonContent[1].map((d: any) => d[this.comparisonSelected]) },
      ],
      true,
    )
  }

  setAportYear() {
    this.populateAportsChart(this.selectedAportsYear)
  }

  getEvolutionOfPatrimony(type: 'year' | 'month') {
    this.subscriptions.push(
      this.homeService
        .getEvolutionList(type)
        .pipe(finalize(() => (this.loadingEvolution = false)))
        .subscribe({
          next: (res: any) => {
            this.evolutionList = res
            const chartData = this.limitToTwelveItems(res)
            this.creatingEvolutionChart(chartData)
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

  setEvolutionView() {
    this.getEvolutionOfPatrimony(this.selectedEvolutionType)
  }

  creatingEvolutionChart(content: any[]) {
    this.chartEvolutionOptions = {
      series: [
        {
          name: 'Patrimônio',
          data: content.map((d: any) => d.total),
          color: this.solidColor1,
        },
      ],
      chart: {
        type: 'area',
        height: 350,
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      xaxis: {
        categories: content.map((d: any) => d.label),
        labels: { style: { colors: '#607D8B' } },
      },
      yaxis: {
        labels: { style: { colors: '#90A4AE' } },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
        // colors: [this.solidColor1],
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 1,
          gradientToColors: [this.solidColor1],
          opacityFrom: 0.7,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      markers: { show: false },
      grid: { strokeDashArray: 4, borderColor: '#ccc' },
      tooltip: {
        followCursor: true,
      },
      legend: { show: false },
    }
  }

  private limitToTwelveItems(data: any[]): any[] {
    if (data.length <= 12) {
      return data
    }

    // Calcula o passo de amostragem para pegar itens uniformemente distribuídos
    const step = Math.ceil(data.length / 12)

    // Filtra os itens mantendo a distribuição uniforme
    return data.filter((_, index) => index % step === 0).slice(0, 12)
  }
}
