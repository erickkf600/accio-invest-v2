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
}
export interface TypeOperationOrType {
  title: string
  full_title: string
  id: number
}
