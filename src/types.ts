export type GiftDirection = 'given' | 'received'

export type GiftEntry = {
  id: string
  direction: GiftDirection
  amount: number
  person: string
  occasion: string
  item: string // New field for what was given/received
  date: string
  note: string
}
