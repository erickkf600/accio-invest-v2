import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@environment'
import { BehaviorSubject, Observable, shareReplay } from 'rxjs'

@Injectable()
export class WalletService {
  cache$: Observable<any>
  public activeTab$: BehaviorSubject<number> = new BehaviorSubject(0)
  constructor(private http: HttpClient) {}

  getResume(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/wallet/resume`)
  }

  getComposition(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/wallet/composition`)
  }

  getAssetsList(): Observable<any[]> {
    if (!this.cache$)
      this.cache$ = this.http.get(`${environment.apiUrl}/wallet/assets-list`).pipe(shareReplay(1))
    return this.cache$
  }

  getRentability(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/wallet/rentability/2025`)
  }

  getPatrimonyGain(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/wallet/patrimony-gain`)
  }
  getVariations(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/wallet/variations`)
  }
  geDividendsComparison(year: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/wallet/dividends-graph/${year}`)
  }
}
