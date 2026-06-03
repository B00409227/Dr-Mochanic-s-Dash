import AuthGuard from '@/components/shared/AuthGuard'
import DashHeader from '@/components/dash/DashHeader'
import BottomNav from '@/components/dash/BottomNav'

export default function DashLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
        <DashHeader />
        <main className="flex-1 relative z-10 pb-24">{children}</main>
        <BottomNav />
      </div>
    </AuthGuard>
  )
}
