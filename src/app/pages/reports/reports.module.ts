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
import { InputTextModule } from 'primeng/inputtext'
import { RecivedRentComponent } from './recived-rent/recived-rent.component'
import { SellsComponent } from './sells/sells.component'
import { UnfoldingsComponent } from './unfoldings/unfoldings.component'
import { ReportsService } from './services/reports.service'
import { BrokerageNotesComponent } from './brokerage-notes/brokerage-notes.component'
import { FileUploadModule } from 'primeng/fileupload'
import { MediumPriceComponent } from './medium-price/medium-price.component'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { CalendarModule } from 'primeng/calendar'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { InputUpperCaseDirective } from 'src/app/directives/input-upper-case.directive'
import { WalletService } from '../wallet/service/wallet.service'
import { InputAutocompleteComponent } from '@components/input-autocomplete/input-autocomplete.component'
import { FixedIncomingComponent } from './fixed-incoming/fixed-incoming.component'
import { TagModule } from 'primeng/tag'
import { TooltipModule } from 'primeng/tooltip'
import { EllipsisPipe } from 'src/app/pipes/ellipsis.pipe'

@NgModule({
  declarations: [
    ReportsComponent,
    AportsComponent,
    DetailModalComponent,
    RecivedRentComponent,
    SellsComponent,
    UnfoldingsComponent,
    BrokerageNotesComponent,
    MediumPriceComponent,
    FixedIncomingComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ButtonModule,
    TabsModule,
    TableModule,
    DynamicDialogModule,
    ToolbarModule,
    InputTextModule,
    FileUploadModule,
    OverlayPanelModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    InputUpperCaseDirective,
    InputAutocompleteComponent,
    TagModule,
    TooltipModule,
    EllipsisPipe
  ],
  providers: [ReportsService, DialogService, CurrencyPipe, WalletService, CurrencyPipe],
})
export class ReportsModule {}
