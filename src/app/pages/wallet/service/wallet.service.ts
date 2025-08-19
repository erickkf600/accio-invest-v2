import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@environment'
import { Observable, shareReplay } from 'rxjs'

@Injectable()
export class WalletService {
  cache$: Observable<any>
  constructor(private http: HttpClient) {}

  getAssetsList(): Observable<any[]> {
    if (!this.cache$)
      this.cache$ = this.http.get(`${environment.apiUrl}/wallet/assets-list`).pipe(shareReplay(1))
    return this.cache$
  }
}
