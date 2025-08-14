import { CommonModule } from '@angular/common'
import { Component, ElementRef, ViewEncapsulation } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HandleThemeService } from '@services/handle-theme.service'
import { MenuModule } from 'primeng/menu'
import { SidebarModule } from 'primeng/sidebar'

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [CommonModule, MenuModule, RouterModule, SidebarModule],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SidemenuComponent {
  menu = [
    {
      items: [
        { label: 'Home', icon: 'pi pi-home', routerLink: ['/home'] },
        {
          label: 'Movimentações',
          icon: 'pi pi-arrow-right-arrow-left',
          routerLink: ['/moviments'],
        },
        { label: 'Carteira', icon: 'pi pi-wallet', routerLink: ['/wallets'] },
        { label: 'Relatórios', icon: 'pi pi-list', routerLink: ['/reports'] },
      ],
    },
    // {
    //   label: 'SIDE_MENU.EVENTS',
    //   items: [
    //     { label: 'SIDE_MENU.SCHEDULE', icon: 'pi pi-calendar', routerLink: ['/uikit/formlayout'] },
    //     { label: 'SIDE_MENU.RECORDS', icon: 'pi pi-table', routerLink: ['/registers'] },
    //   ],
    // },
  ]
  constructor(
    public el: ElementRef,
    public handleTheme: HandleThemeService,
  ) {}
}
