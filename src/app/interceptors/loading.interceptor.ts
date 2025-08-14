import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { LoadingService } from '@components/loader/loading.service'
import { HAS_LOADING } from '@contexts'
import { Observable } from 'rxjs'
import { delay, finalize } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class LoadingInterceptor {
  activeRequests = 0
  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.context.get(HAS_LOADING)) {
      if (this.activeRequests === 0) {
        this.loadingService.setLoading(true)
      }
      this.activeRequests++
      return next.handle(request).pipe(
        delay(1500),
        finalize(() => {
          this.activeRequests--
          if (this.activeRequests === 0) {
            this.loadingService.setLoading(false)
          }
        }),
      )
    }

    return next.handle(request)
  }
}
