import { AbstractControl } from '@angular/forms'
import { parseCurrency } from '@utils/parseCurrency'

// eslint-disable-next-line complexity
// eslint-disable-next-line unused-imports/no-unused-vars
export const MaiorZeroValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
  const rawValue = control.value ?? ''
  const parsed =
    typeof rawValue === 'string' && rawValue.includes('R$')
      ? parseCurrency(rawValue)
      : parseFloat(rawValue)

  return parsed > 0 ? null : { menorOuIgualZero: true }
}
