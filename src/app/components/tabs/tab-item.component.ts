import { Component, Input, TemplateRef, ViewChild } from '@angular/core'

@Component({
  selector: 'tab-item',
  template: ` <ng-template #contentTpl>
    <ng-content></ng-content>
  </ng-template>`,
})
export class TabItemComponent {
  @Input() label!: string
  @Input() icon?: string
  @Input() disabled = false
  @Input() leftIcon?: string
  @Input() rightIcon?: string

  @ViewChild('contentTpl', { static: true })
  contentTemplate!: TemplateRef<unknown>
}
