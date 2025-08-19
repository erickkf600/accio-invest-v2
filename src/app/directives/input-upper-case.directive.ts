import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[inputUpperCase]',
  standalone: true,
})
export class InputUpperCaseDirective {

  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event.target'])
  onInput(input: HTMLInputElement): void {
    const rawValue = input.value;
    const control = this.ngControl?.control;
    if (control) {
      control.setValue(rawValue.toUpperCase(), { emitEvent: false });
    }
  }

}
