import { HeartHandshake, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type SignInPanelProps = {
  onSignIn: () => void
  isLoading: boolean
}

export const SignInPanel = ({ onSignIn, isLoading }: SignInPanelProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HeartHandshake size={32} />
            </div>
            <CardTitle className="font-display text-3xl">
              GiftMateへようこそ
            </CardTitle>
            <CardDescription className="text-lg">
              贈り物の記録を、心地よく整える
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              思い出のやり取りを整理し、受け取った気持ちと贈った気持ちのバランスを可視化します。
              <br />
              Googleアカウントでログインして、あなただけの記録帳を始めましょう。
            </p>
            <Button
              size="lg"
              onClick={onSignIn}
              disabled={isLoading}
              className="w-full max-w-xs"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Googleでログイン
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: '記録', body: '贈った・受け取った履歴を簡単に登録。' },
            { title: '見える化', body: '金額バランスをカードで確認。' },
            { title: '安心', body: 'あなた専用のプライベートメモ。' },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}