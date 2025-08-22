import { Component, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core'
import { Subscription, finalize } from 'rxjs'

import { ConfirmationService, MessageService } from 'primeng/api'
import { ConfirmPopup } from 'primeng/confirmpopup'
import { DataEntity } from '../interface/movements.interface'
import { MovimentsService } from '../services/moviments.service'
import { Table } from 'primeng/table'

@Component({
  selector: 'moviments-list',
  templateUrl: './moviments-list.component.html',
  styleUrl: './moviments-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MovimentsListComponent implements OnDestroy {
  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup

  public subscriptions: Subscription[] = []
  public content: DataEntity[] = []
  public contentFiltered: DataEntity[] = []
  public loading = true
  public filterValue: string
  public paginationConfig: { total: number; rows: number }
  public filterType = [
    { code: 1, name: 'compra' },
    { code: 2, name: 'venda' },
    { code: 3, name: 'dividendos' },
  ]
  selectedFilter: number
  showObsModal: boolean

  constructor(
    private movimentsService: MovimentsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  loadData(ev: any) {
    const pageNumber = ev.first / ev.rows + 1
    if (!ev.globalFilter) {
      this.getContent(pageNumber, ev.rows, true)
    } else {
      this.loading = true
      this.subscriptions.push(
        this.movimentsService
          .searchMoviments(ev.globalFilter)
          .pipe(finalize(() => (this.loading = false)))
          .subscribe({
            next: (res: any) => {
              this.content = res
              this.contentFiltered = res
              this.paginationConfig = { total: res.length, rows: 0 }
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
            this.content = res.data
            this.contentFiltered = res.data
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

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
  }

  typeFilter() {
    if (this.selectedFilter) {
      this.content = this.contentFiltered.filter(
        (el: DataEntity) => el.type_operation.id == this.selectedFilter,
      )
    } else {
      this.content = this.contentFiltered
    }
  }

  deleteMovement(event: Event, content: DataEntity) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Tem certeza que deseja deletar?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-contrast',
      rejectButtonStyleClass: 'p-button-outlined p-button-contrast',
      accept: () => {
        const id = content?.split_inplit
          ? `${content.id}?unfold_id=${content?.split_inplit.id}`
          : content.id

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
      },
      reject: () => {
        this.confirmationService.close()
      },
    })
  }

  openEditor(content: DataEntity) {
    this.movimentsService.editContent$.next(content)
    this.movimentsService.formType.next(content.type_operation.id)
  }
}
