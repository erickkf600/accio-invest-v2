import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {TabItemComponent} from './tab-item.component';
import {TabsComponent} from './tabs.component';

@NgModule({
  declarations: [TabsComponent, TabItemComponent],
  imports: [CommonModule, TabViewModule, ButtonModule],
  exports: [TabsComponent, TabItemComponent],
})
export class TabsModule {}
