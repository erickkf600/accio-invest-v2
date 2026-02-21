import { HttpClient, HttpContext, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { HAS_LOADING } from '@contexts'
import { environment } from '@environment'
import { Observable, shareReplay } from 'rxjs'

@Injectable()
export class ReportsService {
  aportsCache$: Observable<any>
  rentCache$: Observable<any>
  sellCache$: Observable<any>
  splitCache$: Observable<any>
  rfCache$: Observable<any>
  private pmCacheMap: { [key: string]: Observable<Object> } = {}
  private bInvoice: { [key: string]: Observable<Object> } = {}

  constructor(private http: HttpClient) {}

  getAportsHistory(): Observable<Object> {
    if (!this.aportsCache$) {
      this.aportsCache$ = this.http
        .get(`${environment.apiUrl}/reports/history-aports`)
        .pipe(shareReplay(1))
    }
    return this.aportsCache$
  }
  getRentHistory(): Observable<Object> {
    if (!this.rentCache$) {
      this.rentCache$ = this.http
        .get(`${environment.apiUrl}/reports/rent-history`)
        .pipe(shareReplay(1))
    }
    return this.rentCache$
  }
  getSellHistory(): Observable<Object> {
    if (!this.sellCache$) {
      this.sellCache$ = this.http
        .get(`${environment.apiUrl}/reports/sell-history`)
        .pipe(shareReplay(1))
    }
    return this.sellCache$
  }
  getUnfoldHistory(): Observable<Object> {
    if (!this.splitCache$) {
      this.splitCache$ = this.http
        .get(`${environment.apiUrl}/reports/unfolding-history`)
        .pipe(shareReplay(1))
    }
    return this.splitCache$
  }
  getRfHistory(): Observable<Object> {
    if (!this.rfCache$) {
      this.rfCache$ = this.http
        .get(`${environment.apiUrl}/reports/fixed-incoming`)
        .pipe(shareReplay(1))
    }
    return this.rfCache$
  }
  getPmHistory(
    filter: { cod: string; period: string[] },
    clearCache: boolean,
    loading: boolean,
  ): Observable<Object> {
    const cacheKey = JSON.stringify(filter)
    if (clearCache) {
      delete this.pmCacheMap[cacheKey] // limpa cache do filter atual
    }
    if (!this.pmCacheMap[cacheKey]) {
      this.pmCacheMap[cacheKey] = this.http
        .post(`${environment.apiUrl}/reports/medium-price`, filter, {
          context: new HttpContext().set(HAS_LOADING, loading),
        })
        .pipe(shareReplay(1))
    }

    return this.pmCacheMap[cacheKey]
  }
  getBInvoiceHistory(
    clearCache: boolean,
    loading: boolean,
    param: string | null,
    responseType = 'json',
  ): Observable<Object> {
    const cacheKey = JSON.stringify(param)
    if (clearCache) {
      delete this.bInvoice[cacheKey]
    }

    if (!this.bInvoice[cacheKey]) {
      let params = undefined
      if (param !== null) {
        params = new HttpParams().set('path', param)
      }

      this.bInvoice[cacheKey] = this.http
        .get(`${environment.apiUrl}/reports/brokerage-invoices`, {
          context: new HttpContext().set(HAS_LOADING, loading),
          responseType: responseType as any,
          params,
        })
        .pipe(shareReplay(1))
    }

    return this.bInvoice[cacheKey]
  }
  postFile(formData: any): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/reports/upload/brokerage`, formData, {
      context: new HttpContext().set(HAS_LOADING, false),
    })
  }
}
