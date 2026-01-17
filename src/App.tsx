import { useEffect, useState, useMemo } from 'react'
import { LogOut, Plus } from 'lucide-react'
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc, // Import updateDoc
} from 'firebase/firestore'
import { auth, db, googleProvider } from './lib/firebase'
import type { GiftEntry } from './types'
import { GiftForm } from './components/GiftForm'
import { GiftList } from './components/GiftList'
import { SignInPanel } from './components/SignInPanel'
import { BalanceBoard } from './components/BalanceBoard' // Import BalanceBoard
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

function App() {
  const [user, setUser] = useState(() => auth.currentUser)
  const [entries, setEntries] = useState<GiftEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [pastPersons, setPastPersons] = useState<string[]>([])
  const [pastOccasions, setPastOccasions] = useState<string[]>([])
  const [filterPerson, setFilterPerson] = useState('all') // New state for filterPerson

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setIsLoading(false)
    })
    return unsubscribe
  }, [])

  const filteredEntries = useMemo(() => {
    let currentEntries = entries
    if (filterPerson !== 'all') {
      currentEntries = currentEntries.filter(
        (entry) => entry.person === filterPerson,
      )
    }
    return currentEntries
  }, [entries, filterPerson])

  useEffect(() => {
    if (!user) {
      setEntries([])
      setPastPersons([])
      setPastOccasions([])
      return
    }
    const giftsRef = collection(db, 'users', user.uid, 'gifts')
    const giftsQuery = query(giftsRef, orderBy('date', 'desc'))
    const unsubscribe = onSnapshot(giftsQuery, (snapshot) => {
      const nextEntries = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data()
        return {
          id: docSnapshot.id,
          direction: data.direction,
          amount: data.amount,
          person: data.person,
          occasion: data.occasion,
          item: data.item ?? '',
          date: data.date,
          note: data.note ?? '',
        } satisfies GiftEntry
      })
      setEntries(nextEntries)

      // Extract unique persons and occasions for suggestions
      const uniquePersons = Array.from(new Set(nextEntries.map((entry) => entry.person)))
      const uniqueOccasions = Array.from(new Set(nextEntries.map((entry) => entry.occasion)))
      setPastPersons(uniquePersons)
      setPastOccasions(uniqueOccasions)
    })
    return unsubscribe
  }, [user])

  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    await signOut(auth)
  }

  const handleAddEntry = async (values: Omit<GiftEntry, 'id'>) => {
    if (!user) return
    setIsSaving(true)
    try {
      await addDoc(collection(db, 'users', user.uid, 'gifts'), {
        ...values,
        item: values.item,
        createdAt: serverTimestamp(),
      })
      setIsFormOpen(false) // 成功したらフォームを閉じる
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteEntry = async (id: string) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'gifts', id))
  }

  const handleUpdateEntry = async (id: string, values: Omit<GiftEntry, 'id'>) => {
    if (!user) return
    setIsSaving(true)
    try {
      await updateDoc(doc(db, 'users', user.uid, 'gifts', id), {
        ...values,
        updatedAt: serverTimestamp(),
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    )
  }

  if (!user) {
    return <SignInPanel onSignIn={handleSignIn} isLoading={isSigningIn} />
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <div className="min-h-screen bg-background text-foreground max-w-full overflow-x-hidden">
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <p className="text-lg font-semibold tracking-tight">
              GiftMate
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 pl-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="user avatar"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-secondary" />
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 py-8 md:p-10 space-y-8">
          <GiftList
            entries={filteredEntries} // Pass filtered entries
            onDelete={handleDeleteEntry}
            onUpdate={handleUpdateEntry}
            isSaving={isSaving}
            pastPersons={pastPersons}
            pastOccasions={pastOccasions}
            filterPerson={filterPerson} // Pass filterPerson state
            setFilterPerson={setFilterPerson} // Pass setFilterPerson
          />
          <BalanceBoard entries={filteredEntries} /> {/* Pass filtered entries */}
        </main>

        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>新しい記録</DialogTitle>
          </DialogHeader>
          <GiftForm
            onSubmit={handleAddEntry}
            isSaving={isSaving}
            pastPersons={pastPersons}
            pastOccasions={pastOccasions}
          />
        </DialogContent>
      </div>
    </Dialog>
  )
}

export default App