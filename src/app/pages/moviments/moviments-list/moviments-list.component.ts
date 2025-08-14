import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core'
import { Subscription, finalize, take } from 'rxjs'

import { MessageService } from 'primeng/api'
import { DataEntity } from '../interface/movements.interface'
import { MovimentsService } from '../services/moviments.service'

@Component({
  selector: 'moviments-list',
  templateUrl: './moviments-list.component.html',
  styleUrl: './moviments-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MovimentsListComponent implements OnInit, OnDestroy {
  @ViewChild('confirmationModal') confirmModal!: ElementRef

  public subscriptions: Subscription[] = []
  public content: DataEntity[] = []
  public loading = true
  public filterValue: string
  public paginationConfig: { total: number; rows: number }
  public filter = [
    { code: '1', name: 'compra' },
    { code: '2', name: 'venda' },
    { code: '3', name: 'dividendos' },
  ]
  selectedFilter: string
  showObsModal: boolean

  constructor(
    private movimentsService: MovimentsService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.movimentsService.formType$.pipe(take(1)).subscribe((type: number) => {
      if (type === 0) {
        this.getContent(1, 5, true)
      }
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  getContent(page: number = 1, rows: number = 5, pageChange: boolean = false) {
    this.subscriptions.push(
      this.movimentsService
        .getMoviments(page, rows, pageChange)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (res: any) => {
            console.log('CONTEONT', res)
            this.content = res.data
            this.paginationConfig = { total: res.total, rows: res.per_page }
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

  deleteMovement(confirm: boolean, id: number) {
    if (confirm) {
      this.movimentsService.deleteMovimentation(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Movimentação excluída com sucesso',
          })
          this.getContent(1, 5, true)
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

  openEditor(content: DataEntity) {
    this.movimentsService.editContent$.next(content)
    this.movimentsService.formType.next(content.type_operation.id)
  }
}
