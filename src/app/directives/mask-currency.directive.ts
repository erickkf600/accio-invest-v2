import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[currencyMask]',
  standalone: true,
})
export class CurrencyMaskDirective {
  @Input() currencyMask: boolean = true
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event.target'])
  onInput(input: HTMLInputElement): void {
    if(this.currencyMask){
      const rawValue = input.value;
      const masked = this.maskCurrency(rawValue);
      // Atualiza o valor formatado no input
      const control = this.ngControl?.control;
      if (control) {
        control.setValue(rawValue, { emitEvent: false });
      }
      input.value = masked;
    }
  }

  private maskCurrency(value: string): string {
    value = value.replace('.', '').replace(',', '').replace(/\D/g, '');
    const options = { style: 'currency', currency: 'BRL' };
    const maskedValue = new Intl.NumberFormat('pt-BR', options).format(
      parseFloat(value) / 100
    );
    return maskedValue;
  }
}
