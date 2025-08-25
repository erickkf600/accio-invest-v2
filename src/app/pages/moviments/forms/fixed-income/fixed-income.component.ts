import { Component, ViewEncapsulation } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ASSETS_TYPES } from '@mocks/assetsTypes'
import { OPERATION_TYPES } from '@mocks/operationTypes'
import { SPLIT_TYPES } from '@mocks/splitTypes'
import { MessageService } from 'primeng/api'
import { Subscription, finalize, take } from 'rxjs'
import { Unfolding } from '../../interface/movements.interface'
import { MovimentsService } from '../../services/moviments.service'
import { INVEST_TYPES } from '@mocks/investTypes'
import { FORM_TYPES } from '@mocks/formTypes'
import { INDEX_TYPES } from '@mocks/indexTypes'
import { TITLE_TYPES } from '@mocks/titleTypes'
import { InputSwitchChangeEvent } from 'primeng/inputswitch'
import { parseCurrency } from '@utils/parseCurrency'

@Component({
  selector: 'fixed-income-form',
  templateUrl: './fixed-income.component.html',
  styleUrl: './fixed-income.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FixedIncomeComponent {
  public subscriptions: Subscription[] = []
  public buildFormGroup: FormGroup
  public hasCurrencyMask: boolean = true
  public hasCurrencyMask2: boolean = true
  currentIndex = 0
  fixedIncomeEditId: number
  investTypes: any[] = INVEST_TYPES.map(el => ({ value: el.id, label: el.title }))
  titleTypes: any[] = TITLE_TYPES.map((el: any) => ({ value: el.id, label: el.title }))
  formTypes: any[] = FORM_TYPES.map(el => ({ value: el.id, label: el.title }))
  indexTypes: any[] = INDEX_TYPES.map(el => ({ value: el.id, label: el.title }))
  assetTypes: any[] = ASSETS_TYPES.map(el => ({ value: el.id, label: el.title }))
  factors: any[] = SPLIT_TYPES.map(el => ({ value: el.id, label: el.change_type_title }))
  operationTypes: any[] = OPERATION_TYPES.map(el => ({ value: el.id, label: el.title }))
  typeForm = this.movimentsService.formType.getValue()
  savingLoader = false

  constructor(
    public movimentsService: MovimentsService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.movimentsService.editContent$
      .asObservable()
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          if (res.type_operation.id === 3) {
            this.currentIndex = 1
          }
          this._buildFormEdit(res)
          this.fixedIncomeEditId = res.id
        } else {
          this._buildingForm()
        }
      })
  }

  private _buildingForm(): void {
    this.buildFormGroup = new FormGroup({
      emissor: new FormControl(null, Validators.required),
      invest_type: new FormControl(null, Validators.required),
      title_type: new FormControl(null, Validators.required),
      date_operation: new FormControl('', Validators.required),
      date_expiration: new FormControl('', Validators.required),
      daily_liquidity: new FormControl(false),
      form: new FormControl(null, Validators.required),
      index: new FormControl(null, Validators.required),
      value: new FormControl('', Validators.required),
      interest_rate: new FormControl('', Validators.required),
      other_cost: new FormControl(''),
      obs: new FormControl(''),
    })
  }

  private _buildFormEdit(res: any) {
    this.buildFormGroup = new FormGroup({
      emissor: new FormControl(res.fixed_income.emissor, Validators.required),
      invest_type: new FormControl(+res.fixed_income.invest_type, Validators.required),
      title_type: new FormControl(res.fixed_income.title_type, Validators.required),
      date_operation: new FormControl(res.date_operation, Validators.required),
      date_expiration: new FormControl(res.fixed_income.date_expiration, Validators.required),
      daily_liquidity: new FormControl(!!res.fixed_income.daily_liquidity),
      form: new FormControl(res.fixed_income.form, Validators.required),
      index: new FormControl(res.fixed_income.index, Validators.required),
      value: new FormControl(parseFloat(res.fixed_income.total).toFixed(2), Validators.required),
      interest_rate: new FormControl(res.fixed_income.interest_rate, Validators.required),
      other_cost: new FormControl(
        parseFloat(res.fixed_income.other_cost)
          ? parseFloat(res.fixed_income.total).toFixed(2)
          : '',
      ),
      obs: new FormControl(res.obs),
    })
  }

  submitForm() {
    const data = this.buildFormGroup.value
    const payload = Object.assign(data, {
      value: parseCurrency(data.value),
    })

    this.savingLoader = true
    const method = this.fixedIncomeEditId
      ? this.movimentsService.patchMovimentsRF(payload, this.fixedIncomeEditId)
      : this.movimentsService.saveMovimentsRF(payload)
    this.subscriptions.push(
      method.pipe(finalize(() => (this.savingLoader = false))).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Movimentação registrada',
          })
          this.movimentsService.formType.next(0)
        },
        error: error => {
          console.error(error)
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocorreu um erro',
          })
        },
      }),
    )
  }
  close() {
    this.movimentsService.formType.next(0)
    this.movimentsService.editContent$.next(null as any)
  }

  setDaily(ev: InputSwitchChangeEvent) {
    if (ev.checked) {
      this.buildFormGroup.get('date_expiration')?.reset()
      this.buildFormGroup.get('date_expiration')?.disable()
    } else {
      this.buildFormGroup.get('date_expiration')?.enable()
    }
  }
}
