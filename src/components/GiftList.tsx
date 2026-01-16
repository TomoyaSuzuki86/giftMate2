import { Trash2 } from 'lucide-react'
import type { GiftEntry } from '../types'

type GiftListProps = {
  entries: GiftEntry[]
  onDelete: (id: string) => void
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(
    value,
  )

export const GiftList = ({ entries, onDelete }: GiftListProps) => {
  if (entries.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-6 text-center text-sm text-slate-600">
        まだ記録がありません。最初のギフトを登録しましょう。
      </div>
    )
  }

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">履歴</h2>
        <span className="text-xs uppercase tracking-[0.3em] text-emerald-700">
          log
        </span>
      </div>
      <div className="mt-6 grid gap-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-100 bg-white/70 p-4 md:flex-row md:items-center"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {entry.date} • {entry.occasion}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {entry.person}
              </p>
              {entry.note && (
                <p className="mt-1 text-sm text-slate-500">{entry.note}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {entry.direction === 'given' ? '贈った' : '受け取った'}
                </p>
                <p className="font-display text-xl text-emerald-900">
                  {formatCurrency(entry.amount)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                className="rounded-full border border-emerald-200 p-2 text-emerald-900 transition hover:-translate-y-0.5 hover:border-emerald-400"
                aria-label="削除"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
