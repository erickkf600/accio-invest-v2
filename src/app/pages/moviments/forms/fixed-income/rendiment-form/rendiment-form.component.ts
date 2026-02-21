import { Component, OnInit } from '@angular/core'
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { ASSETS_TYPES } from '@mocks/assetsTypes'
import { OPERATION_TYPES } from '@mocks/operationTypes'
import { parseCurrency } from '@utils/parseCurrency'
import { MessageService } from 'primeng/api'
import { OverlayPanel } from 'primeng/overlaypanel'
import { Subscription, finalize, take } from 'rxjs'
import { WalletService } from 'src/app/pages/wallet/service/wallet.service'
import { MovimentsService } from '../../../services/moviments.service'

@Component({
  selector: 'rendiment-form',
  templateUrl: './rendiment-form.component.html',
  styleUrl: './rendiment-form.component.scss',
})
export class RendimentFormComponent implements OnInit {
  public subscriptions: Subscription[] = []
  public buildFormGroup: FormGroup
  public hasCurrencyMask: boolean = true
  public hasCurrencyMask2: boolean = true
  dateSelection: Date[] = []
  searchingDividends = false
  fixedIncomeEdit: any
  savingLoader = false
  assetTypes: any[] = ASSETS_TYPES.map(el => ({ value: el.id, label: el.title }))
  operationTypes: any[] = OPERATION_TYPES.filter(el => el.id === 3 || el.id === 5).map(el => ({
    value: el.id,
    label: el.title,
  }))
  typeForm = this.movimentsService.formType.getValue()

  constructor(
    public movimentsService: MovimentsService,
    private walletService: WalletService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.movimentsService.editContent$
      .asObservable()
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this._buildFormEdit(res)
          this.fixedIncomeEdit = res
        } else {
          this._buildingForm()
        }
      })
  }

  private _buildingForm(): void {
    this.buildFormGroup = new FormGroup({
      date_operation: new FormControl('', Validators.required),
      emissor: new FormControl('', Validators.required),
      total: new FormControl('', Validators.required),
    })
  }

  private _buildFormEdit(res: any) {
    const valorTotal = parseFloat(res.fixed_income.total)
    const porcentagem = parseFloat(res.fixed_income.rentability)
    const valorReal = (porcentagem * valorTotal) / 100
    this.buildFormGroup = new FormGroup({
      date_operation: new FormControl(res.date_operation, Validators.required),
      emissor: new FormControl(res.fixed_income.emissor, Validators.required),
      total: new FormControl(valorReal.toFixed(2), Validators.required),
    })
  }

  submitForm() {
    const data = this.buildFormGroup.value
    data.total = parseCurrency(data.total)
    this.savingLoader = true

    const method = this.fixedIncomeEdit?.id
      ? this.movimentsService.patchRFRendiment(
          { ...data, base_value: this.fixedIncomeEdit.fixed_income.total },
          this.fixedIncomeEdit.id,
        )
      : this.movimentsService.saveRFRendiment(data)
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
}
