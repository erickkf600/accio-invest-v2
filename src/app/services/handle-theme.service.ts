import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class HandleThemeService {
  public _isLight: BehaviorSubject<boolean> = new BehaviorSubject(false)
  readonly _isLight$: Observable<boolean> = this._isLight.asObservable()

  setLightTheme(_bool: boolean) {
    this._isLight.next(_bool)
  }
}
