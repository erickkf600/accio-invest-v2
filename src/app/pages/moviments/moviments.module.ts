import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { MenuComponent } from '@components/menu/menu.component'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { TableModule } from 'primeng/table'
import { MovimentsListComponent } from './moviments-list/moviments-list.component'
import { MovimentsRoutingModule } from './moviments-routing.module'
import { MovimentsComponent } from './moviments.component'
import { MovimentsService } from './services/moviments.service'

@NgModule({
  declarations: [MovimentsComponent, MovimentsListComponent],
  imports: [
    CommonModule,
    MovimentsRoutingModule,
    MenuComponent,
    ButtonModule,
    InputTextModule,
    TableModule,
  ],
  providers: [MovimentsService],
})
export class MovimentsModule {}
