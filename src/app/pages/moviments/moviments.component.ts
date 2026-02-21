import { Component, OnDestroy, OnInit } from '@angular/core'
import { MovimentsService } from './services/moviments.service'
import { Subscription, finalize, map, switchMap } from 'rxjs'
import { MessageService } from 'primeng/api'
import { WalletService } from '../wallet/service/wallet.service'

@Component({
  selector: 'app-moviments',
  templateUrl: './moviments.component.html',
})
export class MovimentsComponent implements OnInit, OnDestroy {
  public formTypes = this.movimentsService.formType$
  public subscriptions: Subscription[] = []
  public titles: string[] = [
    'Adicionar',
    'Compra',
    'Venda',
    'Dividendos',
    'Desdobramento',
    '',
    'Renda fixa',
  ]
  public sessionsNames = [
    'pre-register-movimentacao',
    'pre-register-venda',
    'pre-register-dividendos',
    'pre-register-desdo',
    '',
    'pre-register-renda-fixa',
  ]
  public total = 0
  public tableContent: any
  savingLoader = false
  public menuItens = [
    {
      label: 'Compra',
      command: () => {
        this.movimentsService.formType.next(1)
      },
    },
    {
      label: 'Renda fixa',
      command: () => {
        this.movimentsService.formType.next(6)
      },
    },
    {
      label: 'Proventos',
      command: () => {
        this.movimentsService.formType.next(3)
      },
    },
    {
      label: 'Venda',
      command: () => {
        this.movimentsService.formType.next(2)
      },
    },
    {
      label: 'Desdobramento',
      command: () => {
        this.movimentsService.formType.next(4)
      },
    },
  ]

  constructor(
    public movimentsService: MovimentsService,
    private messageService: MessageService,
    private walletService: WalletService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.movimentsService.formType$
        .pipe(
          switchMap(selectedForm => {
            const sessionKey = this.sessionsNames[selectedForm - 1]
            return this.movimentsService.getSession(sessionKey)
          }),
          map(res => {
            if (res) {
              const sumTotal = res.reduce((acc: number, { total }: any) => acc + total, 0)
              return { res, sumTotal }
            }
            return res
          }),
        )
        .subscribe(res => {
          this.total = res?.sumTotal
          this.tableContent = res?.res
        }),

      this.walletService.getAssetsList().subscribe((res: any[]) => {
        this.movimentsService.assetsList$.next(res.filter(r => r.type_id !== 3).map(el => el.cod))
        this.movimentsService.rfList$.next(res.filter(r => r.type_id === 3).map(el => el.cod))
      }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  removeItemFromSession(key: string, id: number) {
    this.movimentsService.removeFromSession(key, id)
  }

  saveMoviments() {
    const payload = this.tableContent.map((el: any) => {
      return {
        cod: el.cod,
        date_operation: el.date_operation,
        qtd: el.qtd,
        type: el.type,
        type_operation: el.type_operation,
        unity_value: el.unity_value.toString(),
        fee: el.fee || 0,
        obs: el.obs,
        total: el.total,
      }
    })

    this.savingLoader = true
    this.movimentsService
      .saveMoviments(payload)
      .pipe(finalize(() => (this.savingLoader = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Movimentação registrada',
          })
          this.movimentsService.removeSessionKey(
            this.sessionsNames[this.movimentsService.formType.getValue() - 1],
          )
          this.movimentsService.formType.next(0)
        },
        error: error => {
          console.error(error)
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocorreu um erro',
          })
        },
      })
  }
}
