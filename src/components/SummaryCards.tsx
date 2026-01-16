import { ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-react'

type SummaryCardsProps = {
  totalGiven: number
  totalReceived: number
  balance: number
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(
    value,
  )

export const SummaryCards = ({
  totalGiven,
  totalReceived,
  balance,
}: SummaryCardsProps) => {
  const balanceLabel =
    balance === 0
      ? 'ちょうど均衡'
      : balance > 0
        ? '受け取った方が多い'
        : '贈った方が多い'

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-3 text-emerald-900">
          <ArrowUpRight className="h-5 w-5" />
          <span className="text-sm font-semibold tracking-[0.2em] text-emerald-700">
            贈った合計
          </span>
        </div>
        <p className="mt-4 font-display text-3xl">{formatCurrency(totalGiven)}</p>
      </div>
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-3 text-emerald-900">
          <ArrowDownLeft className="h-5 w-5" />
          <span className="text-sm font-semibold tracking-[0.2em] text-emerald-700">
            受け取った合計
          </span>
        </div>
        <p className="mt-4 font-display text-3xl">
          {formatCurrency(totalReceived)}
        </p>
      </div>
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-3 text-emerald-900">
          <Scale className="h-5 w-5" />
          <span className="text-sm font-semibold tracking-[0.2em] text-emerald-700">
            バランス
          </span>
        </div>
        <p className="mt-4 font-display text-3xl">{formatCurrency(balance)}</p>
        <p className="mt-2 text-sm text-slate-600">{balanceLabel}</p>
      </div>
    </div>
  )
}
