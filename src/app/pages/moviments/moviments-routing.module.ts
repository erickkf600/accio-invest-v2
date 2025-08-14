import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovimentsComponent } from './moviments.component';

const routes: Routes = [{ path: '', component: MovimentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimentsRoutingModule { }
