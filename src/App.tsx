import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
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
} from 'firebase/firestore'
import { auth, db, googleProvider } from './lib/firebase'
import type { GiftEntry } from './types'
import { GiftForm } from './components/GiftForm'
import { GiftList } from './components/GiftList'
import { SignInPanel } from './components/SignInPanel'
import { SummaryCards } from './components/SummaryCards'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(
    value,
  )

function App() {
  const [user, setUser] = useState(() => auth.currentUser)
  const [entries, setEntries] = useState<GiftEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setIsLoading(false)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!user) {
      setEntries([])
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
          date: data.date,
          note: data.note ?? '',
        } satisfies GiftEntry
      })
      setEntries(nextEntries)
    })
    return unsubscribe
  }, [user])

  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        if (entry.direction === 'given') {
          acc.given += entry.amount
        } else {
          acc.received += entry.amount
        }
        return acc
      },
      { given: 0, received: 0 },
    )
  }, [entries])

  const balance = totals.received - totals.given

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
        createdAt: serverTimestamp(),
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteEntry = async (id: string) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'gifts', id))
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-600">
        読み込み中...
      </div>
    )
  }

  if (!user) {
    return <SignInPanel onSignIn={handleSignIn} isLoading={isSigningIn} />
  }

  const maxTotal = Math.max(totals.given, totals.received, 1)
  const givenWidth = `${(totals.given / maxTotal) * 100}%`
  const receivedWidth = `${(totals.received / maxTotal) * 100}%`

  return (
    <div className="min-h-screen px-4 pb-16 pt-10 md:px-10">
      <header className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">
            GiftMate
          </p>
          <h1 className="font-display text-4xl text-emerald-950">
            ギフトの流れをひと目で把握
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {user.displayName ?? 'あなた'}の記録帳
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-emerald-200 bg-white/80 px-4 py-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="user avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-emerald-200" />
            )}
            <span className="text-sm text-slate-600">{user.email}</span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900 transition hover:-translate-y-0.5 hover:border-emerald-400"
          >
            <LogOut className="h-4 w-4" />
            ログアウト
          </button>
        </div>
      </header>

      <main className="mx-auto mt-10 flex max-w-6xl flex-col gap-8">
        <SummaryCards
          totalGiven={totals.given}
          totalReceived={totals.received}
          balance={balance}
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">バランスメーター</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-emerald-700">
              balance
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                贈った合計
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatCurrency(totals.given)}
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-emerald-100">
                <div
                  className="h-2 rounded-full bg-emerald-400"
                  style={{ width: givenWidth }}
                />
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                受け取った合計
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatCurrency(totals.received)}
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-emerald-100">
                <div
                  className="h-2 rounded-full bg-amber-400"
                  style={{ width: receivedWidth }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <GiftList entries={entries} onDelete={handleDeleteEntry} />
          <GiftForm onSubmit={handleAddEntry} isSaving={isSaving} />
        </div>
      </main>
    </div>
  )
}

export default App
