import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { GiftDirection } from '../types'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

type GiftFormValues = {
  direction: GiftDirection
  amount: number
  person: string
  occasion: string
  item: string
  date: string
  note: string
}

type GiftFormProps = {
  onSubmit: (values: GiftFormValues) => Promise<void>
  isSaving: boolean
  pastPersons: string[]
  pastOccasions: string[]
}

const baseValues: GiftFormValues = {
  direction: 'given',
  amount: 0,
  person: '',
  occasion: '',
  item: '',
  date: '',
  note: '',
}

export const GiftForm = ({
  onSubmit,
  isSaving,
  pastPersons,
  pastOccasions,
}: GiftFormProps) => {
  const [values, setValues] = useState<GiftFormValues>(() => ({
    ...baseValues,
    date: new Date().toISOString().slice(0, 10),
  }))

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }))
  }

  const handleDirectionChange = (value: GiftDirection) => {
    setValues((prev) => ({ ...prev, direction: value }))
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
    <form onSubmit={handleSubmit}>
      <div className="max-h-[70vh] grid gap-4 overflow-y-auto px-4 py-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="direction">区分</Label>
          <Select
            name="direction"
            value={values.direction}
            onValueChange={handleDirectionChange}
            required
          >
            <SelectTrigger id="direction">
              <SelectValue placeholder="区分を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="given">贈った</SelectItem>
              <SelectItem value="received">受け取った</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">金額</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min={0}
            value={values.amount || ''}
            onChange={handleChange}
            placeholder="例: 5000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="person">相手</Label>
          <Input
            id="person"
            name="person"
            list="person-options"
            value={values.person}
            onChange={handleChange}
            placeholder="入力 or 過去の候補から選択"
            required
          />
          <datalist id="person-options">
            {pastPersons.map((person) => (
              <option key={person} value={person} />
            ))}
          </datalist>
        </div>
        <div className="space-y-2">
          <Label htmlFor="occasion">シーン</Label>
          <Input
            id="occasion"
            name="occasion"
            list="occasion-options"
            value={values.occasion}
            onChange={handleChange}
            placeholder="入力 or 過去の候補から選択"
            required
          />
          <datalist id="occasion-options">
            {pastOccasions.map((occasion) => (
              <option key={occasion} value={occasion} />
            ))}
          </datalist>
        </div>
        <div className="space-y-2">
          <Label htmlFor="item">品物</Label>
          <Input
            id="item"
            name="item"
            value={values.item}
            onChange={handleChange}
            placeholder="例: ワイン、現金"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">日付</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={values.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="note">メモ</Label>
          <Input
            id="note"
            name="note"
            value={values.note}
            onChange={handleChange}
            placeholder="気持ちのメモを短く"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          記録を保存
        </Button>
      </DialogFooter>
    </form>
  )
}
