import { Component, OnInit } from '@angular/core'
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { ASSETS_TYPES } from '@mocks/assetsTypes'
import { OPERATION_TYPES } from '@mocks/operationTypes'
import { parseCurrency } from '@utils/parseCurrency'
import { MessageService } from 'primeng/api'
import { Subscription, take } from 'rxjs'
import { MovimentsService } from '../../services/moviments.service'

@Component({
  selector: 'purchase-form',
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss',
})
export class PurchaseComponent implements OnInit {
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

  get PurchaseArray(): FormArray {
    return this.buildFormGroup.get('purchases') as FormArray
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
      fees: new FormControl('', [Validators.required]),
      date_operation: new FormControl('', Validators.required),
      purchases: new FormArray([this._createPurchaseGroup()]),
    })
  }

  private _buildFormEdit(res: any) {
    this.buildFormGroup = new FormGroup({
      fees: new FormControl(res.fee, [Validators.required]),
      date_operation: new FormControl(res.date_operation, Validators.required),
      purchases: new FormArray([
        new FormGroup({
          type: new FormControl(res.type, Validators.required),
          cod: new FormControl(res.cod, Validators.required),
          unity_value: new FormControl(res.unity_value, Validators.required),
          qtd: new FormControl(res.qtd, Validators.required),
          obs: new FormControl(res.obs),
        }),
      ]),
    })
  }

  private _createPurchaseGroup(): FormGroup {
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
    data.fees = parseCurrency(data.fees)
    const payload = this.PurchaseArray.value.map((el: any, i: number) => {
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
        fee: data.fees,
        total: +el.unity_value * el.qtd,
      }
    })
    this.subscriptions.push(
      this.movimentsService.editContent$.asObservable().subscribe(res => {
        if (!res) {
          this._calcFees(payload, data.fees)
          this.movimentsService.saveInSession('pre-register-movimentacao', payload)
          this.buildFormGroup.reset()
          this.PurchaseArray.clear()
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
    this.PurchaseArray.push(this._createPurchaseGroup())
  }

  public removePurchase(index: number): void {
    this.PurchaseArray.removeAt(index)
  }

  private _calcFees(values: any, fees: number) {
    const sum = values.reduce((acc: number, { total }: any) => total + acc, 0)
    return values.map((ell: any) => {
      const calc = Number(((fees / sum) * ell.total).toFixed(3))
      const math = ell.total + calc
      const calcTotal = Number(math.toFixed(3))
      return Object.assign(ell, {
        fee: calc,
        total: calcTotal,
      })
    })
  }
  close() {
    this.movimentsService.formType.next(0)
    this.movimentsService.editContent$.next(null as any)
  }
}
