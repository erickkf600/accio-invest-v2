import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ChartComponent } from 'ng-apexcharts'
import { MessageService } from 'primeng/api'
import { Subscription, finalize } from 'rxjs'
import { Resume, resume } from './interface/resume.interface'
import { HomeService } from './service/home.service'
import { CalendarEvent } from 'angular-calendar'
import { addHours, format, startOfDay } from 'date-fns'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  cardsContent: any[] = []
  @ViewChild('chart') chart!: ChartComponent
  public chartDistOptions: any
  public chartAlocationsOptions: any
  public chartCDIOptions: any
  public chartAportsOptions: any
  public loading = true
  public loadingCDI = true
  public loadingAports = true
  public loadingEvolution = true
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
  selectedEvolutionType = 'year'
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
  monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

  constructor(
    private homeService: HomeService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.displayResume()
    this.populateCdiChart(this.selectedCDiYear)
    this.populateAportsChart(this.selectedAportsYear)
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
          color: this.solidColor1,
        },
        {
          name: 'Ano atual',
          data: content[1].map((el: any) => el.valor),
          color: this.solidColor2,
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
          data: content[1].map((d: any) => d.valor),
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
  setAportYear() {
    this.populateAportsChart(this.selectedAportsYear)
  }

  getEvolutionOfPatrimony(type: 'year' | 'month', pg = { page: 1, limit: 10 }) {
    this.subscriptions.push(
      this.homeService
        .getEvolutionList(type, pg)
        .pipe(finalize(() => (this.loadingEvolution = false)))
        .subscribe({
          next: (res: any) => {},
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

  setEvolutionView() {}
}
