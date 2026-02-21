import { Component, OnInit } from '@angular/core'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import { TableModule } from 'primeng/table'

@Component({
  selector: 'app-detail-modal',
  templateUrl: './detail-modal.component.html',
})
export class DetailModalComponent {
  constructor(public config: DynamicDialogConfig) {}
}
