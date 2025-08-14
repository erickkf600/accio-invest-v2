import { Component, OnDestroy, OnInit } from '@angular/core'
import { MovimentsService } from './services/moviments.service'
import { Subscription, map, switchMap } from 'rxjs'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-moviments',
  templateUrl: './moviments.component.html',
})
export class MovimentsComponent implements OnInit, OnDestroy {
  public formTypes = this.movimentsService.formType$
  public subscriptions: Subscription[] = []
  public titles: string[] = ['Adicionar', 'Compra', 'Dividendos', 'Venda', 'Desdobramento']
  public sessionsNames = ['pre-register-movimentacao']
  public total = 0
  public tableContent: any
  public menuItens = [
    {
      label: 'Compra',
      command: () => {
        this.movimentsService.formType.next(1)
      },
    },
    {
      label: 'Dividendos',
      command: () => {
        this.movimentsService.formType.next(2)
      },
    },
    {
      label: 'Venda',
      command: () => {
        this.movimentsService.formType.next(3)
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
          console.log(res)
          this.total = res?.sumTotal
          this.tableContent = res?.res
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
        type: el.type.id,
        type_operation: el.type_operation.id,
        unity_value: el.unity_value.toString(),
        fee: el.fee || 0,
        obs: el.obs,
        total: el.total,
        year: +el.date_operation.split('/').pop(),
        month_ref: +el.date_operation.split('/')[1],
      }
    })
    this.movimentsService.saveMoviments(payload).subscribe({
      next: (res: any) => {
        console.log('response', res)
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Movimentação registrada',
        })
        sessionStorage.removeItem(this.sessionsNames[this.movimentsService.formType.getValue() - 1])
      },
      error: error => {
        console.error(error)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocorreu um erro' })
      },
    })
  }
}
