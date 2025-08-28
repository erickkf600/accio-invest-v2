import { Component, OnDestroy } from '@angular/core'
import { ReportsService } from '../../services/reports.service'
import { MessageService } from 'primeng/api'
import { Subscription, finalize } from 'rxjs'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { INVOICE_TYPES } from '@mocks/invoiceTypes'
import { UploadEvent } from 'primeng/fileupload'

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.scss',
})
export class UploadFormComponent implements OnDestroy {
  public subscriptions: Subscription[] = []
  public uploadLoading = false
  uploadedFiles: any[] = []
  invoiceTypes: any[] = INVOICE_TYPES.map(el => ({ value: el.id, label: el.title }))
  public buildFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    date_operation: new FormControl('', Validators.required),
  })
  constructor(
    private messageService: MessageService,
    private reportsService: ReportsService,
  ) {}

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  onUpload(event: UploadEvent) {
    console.log(event)
  }

  // onUpload(ev: Event) {
  //   const files = (ev.target as HTMLInputElement).files
  //   if (!files) return
  //   const formData = new FormData()
  //   Array.from(files).forEach(file => {
  //     const newName = file.name.replace(/\s+/g, '_')
  //     const newFile = new File([file], newName, { type: file.type })

  //     formData.append('notas_corretagem', newFile)
  //   })

  //   this.uploadLoading = true
  //   this.subscriptions.push(
  //     this.reportsService
  //       .postFile(formData)
  //       .pipe(finalize(() => (this.uploadLoading = false)))
  //       .subscribe({
  //         next: () => {
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Sucesso',
  //             detail: 'Documento salvo com sucesso',
  //           })
  //           // this.getContent(true, false)
  //         },
  //         error: err => {
  //           console.error(err)
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Error',
  //             detail: `Ocorreu um erro ao salvar o documento`,
  //           })
  //         },
  //       }),
  //   )
  // }

  submitForm() {}
}
