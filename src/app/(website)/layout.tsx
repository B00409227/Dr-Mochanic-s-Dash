import WebsiteNav from '@/components/website/WebsiteNav'
import WebsiteFooter from '@/components/website/WebsiteFooter'
import FloatingContact from '@/components/website/FloatingContact'

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <WebsiteNav />
      <main className="flex-1 relative z-10">{children}</main>
      <WebsiteFooter />
      <FloatingContact />
    </div>
  )
}
