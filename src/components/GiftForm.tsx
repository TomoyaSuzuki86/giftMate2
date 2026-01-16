import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { GiftDirection } from '../types'

type GiftFormValues = {
  direction: GiftDirection
  amount: number
  person: string
  occasion: string
  date: string
  note: string
}

type GiftFormProps = {
  onSubmit: (values: GiftFormValues) => Promise<void>
  isSaving: boolean
}

const baseValues: GiftFormValues = {
  direction: 'given',
  amount: 0,
  person: '',
  occasion: '',
  date: '',
  note: '',
}

export const GiftForm = ({ onSubmit, isSaving }: GiftFormProps) => {
  const [values, setValues] = useState<GiftFormValues>(() => ({
    ...baseValues,
    date: new Date().toISOString().slice(0, 10),
  }))

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setValues((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await onSubmit(values)
    setValues({
      ...baseValues,
      date: new Date().toISOString().slice(0, 10),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">新しい記録</h2>
        <span className="text-xs uppercase tracking-[0.3em] text-emerald-700">
          entry
        </span>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            区分
          </label>
          <select
            name="direction"
            value={values.direction}
            onChange={handleChange}
            className="rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="given">贈った</option>
            <option value="received">受け取った</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            金額
          </label>
          <input
            name="amount"
            type="number"
            min={0}
            value={values.amount || ''}
            onChange={handleChange}
            placeholder="例: 5000"
            className="rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            相手
          </label>
          <input
            name="person"
            value={values.person}
            onChange={handleChange}
            placeholder="例: 友人A"
            className="rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            シーン
          </label>
          <input
            name="occasion"
            value={values.occasion}
            onChange={handleChange}
            placeholder="例: 誕生日"
            className="rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            日付
          </label>
          <input
            name="date"
            type="date"
            value={values.date}
            onChange={handleChange}
            className="rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            required
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            メモ
          </label>
          <input
            name="note"
            value={values.note}
            onChange={handleChange}
            placeholder="気持ちのメモを短く"
            className="rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-emerald-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          記録を保存
        </button>
      </div>
    </form>
  )
}
