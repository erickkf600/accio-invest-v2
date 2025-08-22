import { Component, OnInit } from '@angular/core'
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { ASSETS_TYPES } from '@mocks/assetsTypes'
import { OPERATION_TYPES } from '@mocks/operationTypes'
import { Subscription, take } from 'rxjs'
import { MovimentsService } from '../../services/moviments.service'
import { MessageService } from 'primeng/api'
import { parseCurrency } from '@utils/parseCurrency'

@Component({
  selector: 'dividends-form',
  templateUrl: './dividends.component.html',
  styleUrl: './dividends.component.scss',
})
export class DividendsComponent implements OnInit {
  public subscriptions: Subscription[] = []
  public buildFormGroup: FormGroup
  public hasCurrencyMask: boolean = true
  public hasCurrencyMask2: boolean = true
  assetTypes: any[] = ASSETS_TYPES.map(el => ({ value: el.id, label: el.title }))
  operationTypes: any[] = OPERATION_TYPES.map(el => ({ value: el.id, label: el.title }))
  typeForm = this.movimentsService.formType.getValue()

  constructor(
    public movimentsService: MovimentsService,
    private messageService: MessageService,
  ) {}

  get DividendsArray(): FormArray {
    return this.buildFormGroup.get('dividends') as FormArray
  }

  ngOnInit(): void {
    this.movimentsService.editContent$
      .asObservable()
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this._buildFormEdit(res)
        } else {
          this._buildingForm()
        }
      })
  }

  private _buildingForm(): void {
    this.buildFormGroup = new FormGroup({
      date_operation: new FormControl('', Validators.required),
      dividends: new FormArray([this._createDividendsGroup()]),
    })
  }

  private _buildFormEdit(res: any) {
    this.buildFormGroup = new FormGroup({
      date_operation: new FormControl(res.date_operation, Validators.required),
      dividends: new FormArray([
        new FormGroup({
          type: new FormControl(res.type.id, Validators.required),
          cod: new FormControl(res.cod, Validators.required),
          unity_value: new FormControl(res.unity_value, Validators.required),
          qtd: new FormControl(res.qtd, Validators.required),
          obs: new FormControl(res.obs),
        }),
      ]),
    })
  }

  private _createDividendsGroup(): FormGroup {
    return new FormGroup({
      type: new FormControl(null, Validators.required),
      cod: new FormControl('', Validators.required),
      unity_value: new FormControl('', Validators.required),
      qtd: new FormControl(null, Validators.required),
      obs: new FormControl(''),
    })
  }

  submitForm() {
    const data = this.buildFormGroup.value
    const payload = this.DividendsArray.value.map((el: any, i: number) => {
      el.unity_value = parseCurrency(el.unity_value)
      return {
        id: new Date().getTime() + i,
        cod: el.cod,
        date_operation: data.date_operation,
        qtd: el.qtd,
        type: el.type,
        type_title: this.assetTypes.find(t => t.value === el.type).label,
        type_operation: this.operationTypes[this.typeForm - 1].value,
        type_operation_title: this.operationTypes[this.typeForm - 1].label,
        unity_value: el.unity_value,
        obs: el.obs,
        fee: 0,
        total: +el.unity_value * el.qtd,
      }
    })
    this.subscriptions.push(
      this.movimentsService.editContent$.asObservable().subscribe(res => {
        if (!res) {
          this.movimentsService.saveInSession('pre-register-dividendos', payload)
          this.buildFormGroup.reset()
          this.DividendsArray.clear()
          this.addPurchase()
        } else {
          this.movimentsService.patchMoviments(payload, res.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Movimentação alterada',
              })
            },
            error: error => {
              console.error(error)
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocorreu um erro',
              })
            },
          })
        }
      }),
    )
  }

  public addPurchase(): void {
    this.DividendsArray.push(this._createDividendsGroup())
  }

  public removePurchase(index: number): void {
    this.DividendsArray.removeAt(index)
  }

  close() {
    this.movimentsService.formType.next(0)
    this.movimentsService.editContent$.next(null as any)
  }
}
