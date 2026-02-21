import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@environment'
import { Observable, shareReplay } from 'rxjs'
import { resume } from '../interface/resume.interface'

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  readonly apiUrl = environment.apiUrl
  constructor(private http: HttpClient) {}
  earningsCache$: Observable<any>
  resumeCache$: Observable<any>
  evolutionCache$: Observable<any>
  comparationCache$: Observable<any>
  aportsCache$: Observable<any>
  getResumeData(): Observable<resume> {
    if (!this.resumeCache$) {
      this.resumeCache$ = this.http.get(`${this.apiUrl}/home/resume`).pipe(shareReplay(1))
    }
    return this.resumeCache$
  }

  getCDIComparation(year: number): Observable<any> {
    if (!this.comparationCache$) {
      this.comparationCache$ = this.http.get(`${this.apiUrl}/home/cdi/${year}`).pipe(shareReplay(1))
    }
    return this.comparationCache$
  }
  getAportsList(year: number): Observable<any> {
    if (!this.aportsCache$) {
      this.aportsCache$ = this.http.get(`${this.apiUrl}/home/aports/${year}`).pipe(shareReplay(1))
    }
    return this.aportsCache$
  }
  getEvolutionList(type: 'year' | 'month'): Observable<any> {
    if (!this.evolutionCache$) {
      this.evolutionCache$ = this.http
        .get(`${this.apiUrl}/home/evolution/${type}`)
        .pipe(shareReplay(1))
    }
    return this.evolutionCache$
  }

  getEarningSchedule(body: any): Observable<any> {
    if (!this.earningsCache$) {
      this.earningsCache$ = this.http
        .post(`${this.apiUrl}/wallet/ticker-earnings`, body)
        .pipe(shareReplay(1))
    }
    return this.earningsCache$
  }
}
