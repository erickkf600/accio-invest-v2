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

  resumeCache$: Observable<any>
  getResumeData(): Observable<resume> {
    this.resumeCache$ = this.http.get(`${this.apiUrl}/home/resume`).pipe(shareReplay(1))
    return this.resumeCache$
  }

  getCDIComparation(year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/home/cdi/${year}`).pipe(shareReplay(1))
  }
  getAportsList(year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/home/aports/${year}`).pipe(shareReplay(1))
  }
  getEvolutionList(type: 'year' | 'month'): Observable<any> {
    return this.http.get(`${this.apiUrl}/home/evolution/${type}`).pipe(shareReplay(1))
  }

  getEarningSchedule(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/wallet/ticker-earnings`, body).pipe(shareReplay(1))
  }
}
