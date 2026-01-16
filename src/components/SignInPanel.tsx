import { motion } from 'framer-motion'
import { HeartHandshake } from 'lucide-react'

type SignInPanelProps = {
  onSignIn: () => void
  isLoading: boolean
}

export const SignInPanel = ({ onSignIn, isLoading }: SignInPanelProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-16">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-10 top-16 h-48 w-48 rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="absolute right-10 top-40 h-56 w-56 rounded-full bg-amber-200/60 blur-3xl" />
      </div>
      <div className="relative mx-auto flex max-w-5xl flex-col gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-10 shadow-glow"
        >
          <div className="flex items-center gap-3 text-emerald-900">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
              <HeartHandshake />
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">
                GiftMate
              </p>
              <h1 className="font-display text-4xl font-semibold">
                贈り物の記録を、心地よく整える
              </h1>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-lg text-slate-700">
            思い出のやり取りを整理し、受け取った気持ちと贈った気持ちのバランスを可視化します。
            ログインすると、あなただけの記録帳がすぐに使えます。
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onSignIn}
              disabled={isLoading}
              className="rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Googleでログイン
            </button>
            <span className="text-sm text-slate-500">
              ログインしないと利用できません
            </span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {[
            { title: '記録', body: '贈った・受け取った履歴を簡単に登録。' },
            { title: '見える化', body: '金額バランスをカードで確認。' },
            { title: '安心', body: 'あなた専用のプライベートメモ。' },
          ].map((item) => (
            <div key={item.title} className="glass-card rounded-2xl p-6">
              <p className="font-display text-xl text-emerald-900">{item.title}</p>
              <p className="mt-2 text-sm text-slate-600">{item.body}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
