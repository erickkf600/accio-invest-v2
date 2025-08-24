import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { ButtonModule } from 'primeng/button'
import { ReportsRoutingModule } from './reports-routing.module'
import { ReportsComponent } from './reports.component'
import { TabsModule } from '@components/tabs/tabs.module'

@NgModule({
  declarations: [ReportsComponent],
  imports: [CommonModule, ReportsRoutingModule, ButtonModule, TabsModule],
})
export class ReportsModule {}
