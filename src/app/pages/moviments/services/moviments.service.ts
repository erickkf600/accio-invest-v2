import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@environment'
import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs'
import { DataEntity } from '../interface/movements.interface'

@Injectable()
export class MovimentsService {
  private changes$ = new BehaviorSubject<void>(undefined)
  public assetsList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  public rfList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  public editContent$: BehaviorSubject<DataEntity> = new BehaviorSubject(null as any)
  constructor(private http: HttpClient) {}
  cache$: Observable<any>
  public formType: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  readonly formType$: Observable<number> = this.formType.asObservable()

  getMoviments(page: number, limit: number, pageChange: boolean = false): Observable<Object> {
    if (!this.cache$ || pageChange)
      this.cache$ = this.http
        .get(`${environment.apiUrl}/moviments/list/${page}/${limit}`)
        .pipe(shareReplay(1))
    return this.cache$
  }

  searchMoviments(search: string): Observable<Object> {
    if (!!search) {
      return this.http.get(`${environment.apiUrl}/moviments/search?search=${search}`)
    }

    return this.getMoviments(1, 5, true)
  }

  saveMoviments(data: any): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/moviments`, data)
  }

  patchMoviments(data: DataEntity[], id: number): Observable<Object> {
    return this.http.patch(`${environment.apiUrl}/moviments/${id}`, data)
  }

  saveInSession(key: string, value: any, reset: boolean = false): void {
    const stored = sessionStorage.getItem(key)
    const currentValue = stored ? JSON.parse(stored) : []

    const newValue = reset
      ? value
      : Array.isArray(currentValue) && Array.isArray(value)
        ? [...currentValue, ...value]
        : value // concatena se forem arrays, senão substitui

    sessionStorage.setItem(key, JSON.stringify(newValue))
    this.changes$.next()
  }
  getSession(stKey: string): Observable<any> {
    return this.changes$.pipe(
      map(() => {
        const stored = sessionStorage.getItem(stKey)
        return stored ? JSON.parse(stored) : null
      }),
    )
  }

  removeFromSession(key: string, id: number): void {
    const stored = sessionStorage.getItem(key)
    if (!stored) return

    const currentValue = JSON.parse(stored)
    if (!Array.isArray(currentValue)) return

    const filtered = currentValue.filter((e: any) => e.id !== id)
    sessionStorage.setItem(key, JSON.stringify(filtered))
    this.changes$.next() // emite mudança
  }
  removeSessionKey(key: string): void {
    sessionStorage.removeItem(key)
    this.changes$.next()
  }

  deleteMovimentation(id: string | number): Observable<Object> {
    return this.http.delete(`${environment.apiUrl}/moviments/${id}`)
  }

  saveMovimentsRF(data: any): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/moviments/fixed-incoming`, data)
  }

  patchMovimentsRF(data: DataEntity, id: number): Observable<Object> {
    return this.http.patch(`${environment.apiUrl}/moviments/fixed-incoming/${id}`, data)
  }

  deleteMovimentationRF(id: string | number): Observable<Object> {
    return this.http.delete(`${environment.apiUrl}/moviments/fixed-incoming/${id}`)
  }

  saveRFRendiment(data: any): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/moviments/fixed-incoming/rendiment`, data)
  }

  patchRFRendiment(data: DataEntity, id: number): Observable<Object> {
    return this.http.patch(`${environment.apiUrl}/moviments/fixed-incoming/rendiment/${id}`, data)
  }
}
