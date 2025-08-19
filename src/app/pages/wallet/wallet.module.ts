import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { WalletRoutingModule } from './wallet-routing.module'
import { WalletComponent } from './wallet.component'
import { WalletService } from './service/wallet.service'

@NgModule({
  declarations: [WalletComponent],
  imports: [CommonModule, WalletRoutingModule],
  providers: [WalletService],
})
export class WalletModule {}
