import { Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ASSETS_TYPES } from '@mocks/assetsTypes'
import { OPERATION_TYPES } from '@mocks/operationTypes'
import { SPLIT_TYPES } from '@mocks/splitTypes'
import { MessageService } from 'primeng/api'
import { Subscription, finalize, take } from 'rxjs'
import { MovimentsService } from '../../services/moviments.service'
import { Unfolding } from '../../interface/movements.interface'

@Component({
  selector: 'split-form',
  templateUrl: './split.component.html',
  styleUrl: './split.component.scss',
})
export class SplitComponent {
  public subscriptions: Subscription[] = []
  public buildFormGroup: FormGroup
  public hasCurrencyMask: boolean = true
  public hasCurrencyMask2: boolean = true
  splitEditId: number
  unfoldingData: Unfolding
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
          this._buildFormEdit(res)
          this.splitEditId = res.id
          this.unfoldingData = res?.split_inplit as Unfolding
        } else {
          this._buildingForm()
        }
      })
  }

  private _buildingForm(): void {
    this.buildFormGroup = new FormGroup({
      cod: new FormControl('', Validators.required),
      date_operation: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      factor: new FormControl('', Validators.required),
      from: new FormControl(null, Validators.required),
      to: new FormControl(null, Validators.required),
      obs: new FormControl(''),
    })
  }

  private _buildFormEdit(res: any) {
    this.buildFormGroup = new FormGroup({
      cod: new FormControl(res.cod, Validators.required),
      date_operation: new FormControl(res.date_operation, Validators.required),
      type: new FormControl(res.type, Validators.required),
      factor: new FormControl(res?.split_inplit.factor, Validators.required),
      from: new FormControl(res?.split_inplit.from, Validators.required),
      to: new FormControl(res?.split_inplit.to, Validators.required),
      obs: new FormControl(res.obs),
    })
  }

  submitForm() {
    const data = this.buildFormGroup.value
    const payload = {
      ...data,
      type: this.splitEditId ? data.type.id : data.type,
      type_operation: this.operationTypes[this.typeForm - 1].value,
    }
    if (this.unfoldingData) {
      payload.unfold_id = this.unfoldingData.id
    }

    this.savingLoader = true

    const method = this.splitEditId
      ? this.movimentsService.patchMoviments([payload], this.splitEditId)
      : this.movimentsService.saveMoviments(payload)
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
}
