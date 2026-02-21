import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'ellipsis',
  standalone: true,
})
export class EllipsisPipe implements PipeTransform {
  transform(value: any, maxLength = 26): any {
    if (value && value?.length <= maxLength) {
      return value
    } else {
      return value?.substring(0, maxLength) + '...'
    }
  }
}
