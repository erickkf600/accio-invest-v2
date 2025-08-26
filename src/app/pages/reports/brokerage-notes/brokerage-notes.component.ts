import { Component, OnDestroy, OnInit } from '@angular/core'
import { MessageService } from 'primeng/api'
import { Subscription } from 'rxjs'
import { ReportsService } from '../services/reports.service'
import { Table } from 'primeng/table'

@Component({
  selector: 'brokerage-notes',
  templateUrl: './brokerage-notes.component.html',
  styleUrl: './brokerage-notes.component.scss',
})
export class BrokerageNotesComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = []

  brokerageContent: [] = []
  total: any
  constructor(
    private reportsService: ReportsService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.getSell()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
  }
  getSell() {
    this.subscriptions.push(
      this.reportsService.getSellHistory().subscribe({
        next: (res: any) => {
          this.brokerageContent = res
          this.total = res.reduce((acc: any, el: any) => acc + el.total, 0)
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

  onUpload(ev: any) {
    console.log(ev)
  }
}
