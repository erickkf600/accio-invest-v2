export interface moviments {
  data: DataEntity[] | null
  total: number
  current_page: number
  per_page: number
}
export interface DataEntity {
  id: number
  cod: string
  date_operation: string
  qtd: number
  unity_value: number
  obs: string
  fee: number
  total: number
  type_operation: TypeOperationOrType
  type: TypeOperationOrType
  split_inplit?: Unfolding
  fixed_income?: FixedIncome
}

export interface Unfolding {
  id: number
  from: number
  to: number
  factor: number
}
export interface FixedIncome {
  id: number
  emissor: string
  interest_rate: string
  invest_type: string
  title_type: number
  date_operation: string
  date_expiration: string
  form: number
  index: number
  obs: string
  total: string
  daily_liquidity: number
  other_cost: string
}

export interface TypeOperationOrType {
  title: string
  full_title: string
  id: number
}
