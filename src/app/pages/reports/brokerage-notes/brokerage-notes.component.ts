import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { MessageService } from 'primeng/api'
import { Subscription, finalize } from 'rxjs'
import { ReportsService } from '../services/reports.service'
import { Table } from 'primeng/table'
import { DialogService } from 'primeng/dynamicdialog'
import { UploadFormComponent } from './upload-form/upload-form.component'

@Component({
  selector: 'brokerage-notes',
  templateUrl: './brokerage-notes.component.html',
  styleUrl: './brokerage-notes.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BrokerageNotesComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = []
  uploadLoading = false
  brokerageContent: [] = []
  total: any
  pdfUrl: any
  constructor(
    private reportsService: ReportsService,
    private messageService: MessageService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.getContent()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
  }
  getContent(clearCache = false, loading = true, param: string | null = null) {
    this.subscriptions.push(
      this.reportsService.getBInvoiceHistory(clearCache, loading, param).subscribe({
        next: (res: any) => {
          this.brokerageContent = res
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

  openForm() {
    this.dialogService.open(UploadFormComponent, {
      header: `Upload de documento`,
      styleClass: 'upload-modal',
    })
  }

  viewFile(path: string) {
    this.subscriptions.push(
      this.reportsService.getBInvoiceHistory(true, false, path, 'blob').subscribe({
        next: (res: any) => {
          const file = new Blob([res], { type: 'application/pdf' })
          const pdfUrl = URL.createObjectURL(file)
          window.open(pdfUrl)
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
