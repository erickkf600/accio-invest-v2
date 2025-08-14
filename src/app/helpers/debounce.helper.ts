/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export function Debounce(delay: number = 500): MethodDecorator {
   return function (_: any, __: any, descriptor: PropertyDescriptor) {
      let timeout: any = null
      const orginal = descriptor.value
      descriptor.value = function (...args: any) {
         clearTimeout(timeout)
         timeout = setTimeout(() => orginal.apply(this, args), delay)
      }
      return descriptor
   }
}
