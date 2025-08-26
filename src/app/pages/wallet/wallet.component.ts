import { Component, OnDestroy, OnInit } from '@angular/core'
import { WalletService } from './service/wallet.service'
import { Subscription, finalize } from 'rxjs'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss',
})
export class WalletComponent implements OnInit, OnDestroy {
  activeTabIndex = 0
  private subscriptions: Subscription[] = []
  public resume: any[] = []

  constructor(
    private walletService: WalletService,
    private messageService: MessageService,
  ) {}

  setActiveTab({ index }: { index: number }) {
    this.walletService.activeTab$.next(index)
  }
  ngOnInit(): void {
    this.walletResume()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  private walletResume() {
    this.subscriptions.push(
      this.walletService.getResume().subscribe({
        next: (res: any) => {
          this.resume = [
            {
              title: 'Saldo médio',
              value: `R$ ${res.total_medium.toFixed(2)}`,
              icon: 'pi pi-wallet',
              iconColor: 'text-blue-500',
              iconBg: 'bg-blue-100',
              help: 'Soma dos preços médios',
            },
            {
              title: 'Patrimônio',
              value: `R$ ${res.patrimony.toFixed(2)}`,
              icon: 'pi pi-chart-line',
              iconColor: 'text-red-500',
              iconBg: 'bg-red-100',
              help: 'Valor de mercado mais proventos',
            },
            {
              title: 'Total de rendimento',
              value: `R$ ${res.total_provents.toFixed(2)}`,
              icon: 'pi pi-dollar',
              iconColor: 'text-green-500',
              iconBg: 'bg-green-100',
            },
          ]
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
