import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@environment'
import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs'
import { DataEntity } from '../interface/movements.interface'

@Injectable()
export class MovimentsService {
  public preSaved$: BehaviorSubject<any> = new BehaviorSubject([])
  public assetsList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
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
    if (reset) {
      sessionStorage.setItem(key, JSON.stringify(value))
      this.preSaved$.next({ [key]: value })
    } else {
      const stored = sessionStorage.getItem(key)
      const currentValue = stored ? JSON.parse(stored) : []
      sessionStorage.setItem(key, JSON.stringify([...currentValue, ...value]))
      this.preSaved$.next(this.preSaved$.next({ ...currentValue, [key]: value }))
    }
  }
  getSession(stKey: string): Observable<any> {
    return this.preSaved$.pipe(
      map(data => {
        const value = data?.[stKey]
        return value ?? JSON.parse(sessionStorage.getItem(stKey) as string)
      }),
    )
  }

  removeFromSession(key: string, id: number): void {
    const currentValue = JSON.parse(sessionStorage.getItem(key) as any)
    const realIndex = currentValue.findIndex((e: any) => e.id === id)
    currentValue.splice(realIndex, 1)
    sessionStorage.setItem(key, JSON.stringify(currentValue))
    this.preSaved$.next(currentValue)
  }

  deleteMovimentation(id: string | number): Observable<Object> {
    return this.http.delete(`${environment.apiUrl}/moviments/${id}`)
  }
}
