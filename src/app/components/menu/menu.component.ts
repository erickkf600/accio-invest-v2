import { Component, Input, ViewChild } from '@angular/core'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { MenuModule } from 'primeng/menu'

@Component({
  selector: 'app-menu',
  styleUrl: './menu.component.scss',
  standalone: true,
  imports: [MenuModule],
  template: `
    <div class="custom-menu relative">
      <p-menu [model]="items" #menu styleClass="p-2" [popup]="true" appendTo="body">
        <ng-template pTemplate="submenuheader" let-item let-root="root">
          <span class="font-bold custom-menu__label py-2 block">{{ item.label }}</span>
        </ng-template>
        <ng-template pTemplate="item" let-item>
          <a
            class="cursor-pointer text-color-secondary flex align-items-center gap-2 px-2 py-2 text-sm transition border-round hover:surface-200 w-full"
          >
            <span [class]="item.icon"></span>
            <span class="font-medium">{{ item.label }}</span>
          </a>
        </ng-template>
      </p-menu>
    </div>
  `,
})
export class MenuComponent {
  @ViewChild('menu') menu: any
  @Input() items: any
  toggle(ev: any) {
    this.menu.toggle(ev)
  }
}
