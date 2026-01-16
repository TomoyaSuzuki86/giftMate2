export type GiftDirection = 'given' | 'received'

export type GiftEntry = {
  id: string
  direction: GiftDirection
  amount: number
  person: string
  occasion: string
  date: string
  note: string
}
