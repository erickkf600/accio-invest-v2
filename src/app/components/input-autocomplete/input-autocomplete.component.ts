import { CommonModule } from '@angular/common'
import { AfterContentInit, Component, ContentChild, ElementRef, Input } from '@angular/core'

@Component({
  selector: 'input-autocomplete',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-content select="label"></ng-content>
    <ng-content select="input"></ng-content>

    <datalist [id]="listId">
      <option *ngFor="let item of options" [value]="item"></option>
    </datalist>
  `,
})
export class InputAutocompleteComponent implements AfterContentInit {
  @ContentChild('inputRef', { read: ElementRef }) inputEl?: ElementRef
  listId = 'auto-list-' + Math.random().toString(36).substring(2, 9)
  @Input() options: string[] = []

  ngAfterContentInit() {
    if (this.inputEl) {
      this.inputEl.nativeElement.setAttribute('list', this.listId)
    }
  }
}
