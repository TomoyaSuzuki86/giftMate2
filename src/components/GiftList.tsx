import { useState, useMemo } from 'react'
import type { GiftEntry } from '../types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EditGiftForm } from './EditGiftForm' // Import EditGiftForm

type GiftListProps = {
  entries: GiftEntry[]
  onDelete: (id: string) => Promise<void>
  onUpdate: (id: string, values: Omit<GiftEntry, 'id'>) => Promise<void>
  isSaving: boolean
  pastPersons: string[]
  pastOccasions: string[]
  filterPerson: string // New prop
  setFilterPerson: (person: string) => void // New prop
}

type SortColumn = 'date' | 'amount' | 'person' | 'occasion' | 'item'
type SortDirection = 'asc' | 'desc'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(
    value,
  )

export const GiftList = ({
  entries,
  onDelete,
  onUpdate,
  isSaving,
  pastPersons,
  pastOccasions,
  filterPerson,
  setFilterPerson,
}: GiftListProps) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedEntry, setSelectedEntry] = useState<GiftEntry | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const uniquePersonsForFilter = useMemo(() => {
    return ['all', ...pastPersons].sort()
  }, [pastPersons])

  const filteredAndSortedEntries = useMemo(() => {
    let currentEntries = [...entries] // entries are already filtered by filterPerson from App.tsx

    currentEntries.sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      return 0
    })
    return currentEntries
  }, [entries, sortColumn, sortDirection])

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc') // Default to desc for new sort column
    }
  }

  const openDetailModal = (entry: GiftEntry) => {
    setSelectedEntry(entry)
    setIsDetailModalOpen(true)
  }

  const handleUpdateFromModal = async (
    id: string,
    values: Omit<GiftEntry, 'id'>,
  ) => {
    await onUpdate(id, values)
    setIsDetailModalOpen(false)
    setSelectedEntry(null)
  }

  const handleDeleteFromModal = async (id: string) => {
    await onDelete(id)
    setIsDetailModalOpen(false)
    setSelectedEntry(null)
  }

  const handleCancelEdit = () => {
    setIsDetailModalOpen(false)
    setSelectedEntry(null)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-4 flex-wrap"> {/* Added flex-wrap here */}
          <CardTitle className="min-w-0">履歴</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs text-muted-foreground gap-2"> {/* Legend can stack internally */}
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-200 rounded-full" /> 贈った
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-200 rounded-full" /> 受け取った
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={filterPerson}
            onValueChange={(value: string) => setFilterPerson(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="相手で絞り込み" />
            </SelectTrigger>
            <SelectContent>
              {uniquePersonsForFilter.map((person) => (
                <SelectItem key={person} value={person}>
                  {person === 'all' ? '全て' : person}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAndSortedEntries.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            <p>まだ記録がありません。</p>
            <p>最初のギフトを登録しましょう。</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      日付
                      {sortColumn === 'date' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort('person')}
                  >
                    <div className="flex items-center">
                      相手
                      {sortColumn === 'person' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort('item')}
                  >
                    <div className="flex items-center">
                      品物
                      {sortColumn === 'item' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center justify-end">
                      金額
                      {sortColumn === 'amount' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedEntries.map((entry) => (
                  <TableRow
                    key={entry.id}
                    onClick={() => openDetailModal(entry)}
                    className={`cursor-pointer ${
                      entry.direction === 'given'
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    <TableCell>{entry.date}</TableCell>
                    <TableCell className="font-medium">
                      {entry.person}
                      <div className="text-sm text-muted-foreground">
                        {entry.occasion}
                      </div>
                    </TableCell>
                    <TableCell>{entry.item}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(entry.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle>記録編集</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <EditGiftForm
              initialValues={selectedEntry}
              onSubmit={handleUpdateFromModal}
              onDelete={handleDeleteFromModal}
              onCancel={handleCancelEdit}
              isSaving={isSaving}
              pastPersons={pastPersons}
              pastOccasions={pastOccasions}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}



