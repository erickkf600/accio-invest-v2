import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { TabsModule } from '@components/tabs/tabs.module'
import { NgApexchartsModule } from 'ng-apexcharts'
import { TableModule } from 'primeng/table'
import { TabViewModule } from 'primeng/tabview'
import { TagModule } from 'primeng/tag'
import { MyProductsComponent } from './my-products/my-products.component'
import { RentabilityComponent } from './rentability/rentability.component'
import { WalletService } from './service/wallet.service'
import { WalletRoutingModule } from './wallet-routing.module'
import { WalletComponent } from './wallet.component'
import { ProventsComponent } from './provents/provents.component'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { ConfirmPopupModule } from 'primeng/confirmpopup'
import { ConfirmationService } from 'primeng/api'
import { MultiSelectModule } from 'primeng/multiselect'

@NgModule({
  declarations: [WalletComponent, MyProductsComponent, RentabilityComponent, ProventsComponent],
  imports: [
    CommonModule,
    WalletRoutingModule,
    NgApexchartsModule,
    TabsModule,
    TableModule,
    TabViewModule,
    TagModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    ConfirmPopupModule,
    MultiSelectModule,
    FormsModule,
  ],
  providers: [WalletService, ConfirmationService],
})
export class WalletModule {}
