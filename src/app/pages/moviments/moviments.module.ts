import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MenuComponent } from '@components/menu/menu.component'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { TableModule } from 'primeng/table'
import { ToggleButtonModule } from 'primeng/togglebutton'
import { CurrencyMaskDirective } from 'src/app/directives/mask-currency.directive'
import { DividendsComponent } from './forms/dividends/dividends.component'
import { PurchaseComponent } from './forms/purchase/purchase.component'
import { SellComponent } from './forms/sell/sell.component'
import { SplitComponent } from './forms/split/split.component'
import { MovimentsListComponent } from './moviments-list/moviments-list.component'
import { MovimentsRoutingModule } from './moviments-routing.module'
import { MovimentsComponent } from './moviments.component'
import { MovimentsService } from './services/moviments.service'
import { InputUpperCaseDirective } from 'src/app/directives/input-upper-case.directive'
import { InputMaskModule } from 'primeng/inputmask'
import { DropdownModule } from 'primeng/dropdown'
import { InputNumberModule } from 'primeng/inputnumber'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { ConfirmPopupModule } from 'primeng/confirmpopup'
import { ConfirmationService } from 'primeng/api'
import { WalletService } from '../wallet/service/wallet.service'
import { InputAutocompleteComponent } from '@components/input-autocomplete/input-autocomplete.component'
@NgModule({
  declarations: [
    MovimentsComponent,
    MovimentsListComponent,
    DividendsComponent,
    PurchaseComponent,
    SellComponent,
    SplitComponent,
  ],
  imports: [
    CommonModule,
    MovimentsRoutingModule,
    MenuComponent,
    ButtonModule,
    InputTextModule,
    ToggleButtonModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskDirective,
    InputUpperCaseDirective,
    InputMaskModule,
    DropdownModule,
    InputNumberModule,
    InputTextareaModule,
    ConfirmPopupModule,
    InputAutocompleteComponent,
  ],
  providers: [MovimentsService, ConfirmationService, WalletService],
})
export class MovimentsModule {}
