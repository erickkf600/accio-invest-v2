export interface resume {
  resume: Resume
  alocations?: AlocationsEntity[] | null
  distribuition?: DistribuitionEntity[] | null
  aports?: (EntityOrAportsEntityEntity[] | null)[] | null
}
export interface Resume {
  total: number
  last: number
  last_dividend: number
  patrimony: number
  startYear: number
}
export interface AlocationsEntity {
  type: string
  qtd: number
  total: number
  hex: string
  title: string
}
export interface DistribuitionEntity {
  title: string
  qtd: number
  hex: string
}
export interface EntityOrAportsEntityEntity {
  data: string
  label: string
  valor: number
  ano: number
}
