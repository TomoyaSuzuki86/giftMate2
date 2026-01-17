import { useState, useEffect } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { GiftDirection, GiftEntry } from '../types'
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
import { Loader2, Trash2 } from 'lucide-react'

type EditGiftFormValues = Omit<GiftEntry, 'id'>

type EditGiftFormProps = {
  initialValues: GiftEntry
  onSubmit: (id: string, values: EditGiftFormValues) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onCancel: () => void
  isSaving: boolean
  pastPersons: string[]
  pastOccasions: string[]
}

export const EditGiftForm = ({
  initialValues,
  onSubmit,
  onDelete,
  onCancel,
  isSaving,
  pastPersons,
  pastOccasions,
}: EditGiftFormProps) => {
  const [values, setValues] = useState<EditGiftFormValues>(initialValues)
  const [showOtherPersonInput, setShowOtherPersonInput] = useState(false)
  const [showOtherOccasionInput, setShowOtherOccasionInput] = useState(false)

  useEffect(() => {
    setValues(initialValues)
    // Reset "other" input visibility when initialValues change
    setShowOtherPersonInput(
      !pastPersons.includes(initialValues.person) && initialValues.person !== '',
    )
    setShowOtherOccasionInput(
      !pastOccasions.includes(initialValues.occasion) && initialValues.occasion !== '',
    )
  }, [initialValues, pastPersons, pastOccasions])

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

  const handlePersonSelectChange = (value: string) => {
    if (value === 'other') {
      setShowOtherPersonInput(true)
      setValues((prev) => ({ ...prev, person: '' }))
    } else {
      setShowOtherPersonInput(false)
      setValues((prev) => ({ ...prev, person: value }))
    }
  }

  const handleOccasionSelectChange = (value: string) => {
    if (value === 'other') {
      setShowOtherOccasionInput(true)
      setValues((prev) => ({ ...prev, occasion: '' }))
    } else {
      setShowOtherOccasionInput(false)
      setValues((prev) => ({ ...prev, occasion: value }))
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await onSubmit(initialValues.id, values)
  }

  const handleDelete = async () => {
    await onDelete(initialValues.id)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4 md:grid-cols-2 max-h-[70vh] overflow-y-auto px-4">
        <div className="space-y-2">
          <Label htmlFor="direction">区分</Label>
          <Select
            name="direction"
            value={values.direction}
            onValueChange={handleDirectionChange}
            required
            disabled={isSaving}
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
            disabled={isSaving}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="person">相手</Label>
          <Select
            value={
              showOtherPersonInput
                ? 'other'
                : pastPersons.includes(values.person)
                  ? values.person
                  : 'other' // If current person is not in pastPersons, treat as 'other'
            }
            onValueChange={handlePersonSelectChange}
            required
            disabled={isSaving}
          >
            <SelectTrigger id="person">
              <SelectValue placeholder="相手を選択" />
            </SelectTrigger>
            <SelectContent>
              {pastPersons.map((person) => (
                <SelectItem key={person} value={person}>
                  {person}
                </SelectItem>
              ))}
              <SelectItem value="other">その他 (手入力)</SelectItem>
            </SelectContent>
          </Select>
          {showOtherPersonInput && (
            <Input
              id="otherPerson"
              name="person"
              value={values.person}
              onChange={handleChange}
              placeholder="新しい相手を入力"
              className="mt-2"
              required
              disabled={isSaving}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="occasion">シーン</Label>
          <Select
            value={
              showOtherOccasionInput
                ? 'other'
                : pastOccasions.includes(values.occasion)
                  ? values.occasion
                  : 'other' // If current occasion is not in pastOccasions, treat as 'other'
            }
            onValueChange={handleOccasionSelectChange}
            required
            disabled={isSaving}
          >
            <SelectTrigger id="occasion">
              <SelectValue placeholder="シーンを選択" />
            </SelectTrigger>
            <SelectContent>
              {pastOccasions.map((occasion) => (
                <SelectItem key={occasion} value={occasion}>
                  {occasion}
                </SelectItem>
              ))}
              <SelectItem value="other">その他 (手入力)</SelectItem>
            </SelectContent>
          </Select>
          {showOtherOccasionInput && (
            <Input
              id="otherOccasion"
              name="occasion"
              value={values.occasion}
              onChange={handleChange}
              placeholder="新しいシーンを入力"
              className="mt-2"
              required
              disabled={isSaving}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="item">品物</Label>
          <Input
            id="item"
            name="item"
            value={values.item}
            onChange={handleChange}
            placeholder="例: ワイン、お菓子"
            required
            disabled={isSaving}
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
            disabled={isSaving}
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
            disabled={isSaving}
          />
        </div>
      </div>
      <DialogFooter className="flex-row justify-between">
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSaving}>
          <Trash2 className="mr-2 h-4 w-4" />
          削除
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            キャンセル
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存
          </Button>
        </div>
      </DialogFooter>
    </form>
  )
}
