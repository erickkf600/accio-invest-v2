import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading$: Subject<boolean> = new Subject<boolean>()

  readonly loading$: Observable<boolean> = this._loading$.asObservable()

  setLoading(loading: boolean): void {
    this._loading$.next(loading)
  }
}
