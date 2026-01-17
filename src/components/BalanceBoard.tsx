import type { GiftEntry } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type BalanceBoardProps = {
  entries: GiftEntry[]
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(
    value,
  )

export const BalanceBoard = ({ entries }: BalanceBoardProps) => {
  const totalGiven = entries
    .filter((entry) => entry.direction === 'given')
    .reduce((sum, entry) => sum + entry.amount, 0)

  const totalReceived = entries
    .filter((entry) => entry.direction === 'received')
    .reduce((sum, entry) => sum + entry.amount, 0)

  const balance = totalReceived - totalGiven

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">収支</CardTitle>
        <Badge variant={balance >= 0 ? 'default' : 'destructive'}>
          BALANCE
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
      </CardContent>
    </Card>
  )
}
