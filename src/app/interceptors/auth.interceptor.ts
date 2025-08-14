import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AppEnum } from '@enums'
import { environment } from '@environment'
import { Observable } from 'rxjs'
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private token_header_key = 'Authorization'
  readonly api_url: string = environment.apiUrl
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(AppEnum.USER_TOKEN)
    if (!!token && request.url.includes(this.api_url) && !request.url.includes('refresh')) {
      request = request.clone({
        headers: request.headers.set(this.token_header_key, 'Bearer ' + token),
      })
    }
    return next.handle(request)
  }
}
