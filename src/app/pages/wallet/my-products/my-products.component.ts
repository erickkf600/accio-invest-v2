import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ChartComponent } from 'ng-apexcharts'
import { MessageService } from 'primeng/api'
import { Subscription, finalize } from 'rxjs'
import { WalletService } from '../service/wallet.service'

@Component({
  selector: 'my-products',
  templateUrl: './my-products.component.html',
  styleUrl: './my-products.component.scss',
})
export class MyProductsComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart!: ChartComponent
  public chartAlocationsOptions: any
  private subscriptions: Subscription[] = []
  public compLoading = true
  public alocations: any[] = []
  public assets: any[]

  constructor(
    public walletService: WalletService,
    private messageService: MessageService,
  ) {}
  ngOnInit(): void {
    this.walletComposition()
    this.walletAssets()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  private walletComposition() {
    this.subscriptions.push(
      this.walletService
        .getComposition()
        .pipe(finalize(() => (this.compLoading = false)))
        .subscribe({
          next: (res: any) => {
            this.alocations = res
            this.createDonutChart()
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
    this.chartAlocationsOptions = {
      series: this.alocations.map(item => item.qtd),
      chart: { type: 'donut' },
      labels: this.alocations.map(item => item.type),
      colors: this.alocations.map(item => item.hex),
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

  private walletAssets() {
    this.subscriptions.push(
      this.walletService.getAssetsList().subscribe({
        next: (res: any) => {
          this.assets = res
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
