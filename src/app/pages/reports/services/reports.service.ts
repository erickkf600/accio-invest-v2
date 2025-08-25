import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private http: HttpClient) {}

  getAportsHistory(): Observable<Object> {
    return this.http.get(`${environment.apiUrl}/reports/history-aports`)
  }
}
