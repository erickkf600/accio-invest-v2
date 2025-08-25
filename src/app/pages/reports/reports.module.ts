import { CommonModule, CurrencyPipe } from '@angular/common'
import { NgModule } from '@angular/core'

import { TabsModule } from '@components/tabs/tabs.module'
import { ButtonModule } from 'primeng/button'
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog'
import { TableModule } from 'primeng/table'
import { AportsComponent } from './aports/aports.component'
import { ReportsRoutingModule } from './reports-routing.module'
import { ReportsComponent } from './reports.component'
import { DetailModalComponent } from './aports/detail-modal/detail-modal.component'
import { ToolbarModule } from 'primeng/toolbar'

@NgModule({
  declarations: [ReportsComponent, AportsComponent, DetailModalComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ButtonModule,
    TabsModule,
    TableModule,
    DynamicDialogModule,
    ToolbarModule,
  ],
  providers: [DialogService, CurrencyPipe],
})
export class ReportsModule {}
