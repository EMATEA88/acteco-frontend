import { lazy, Suspense } from 'react'

const PromoCarousel = lazy(() => import('../components/PromoCarousel'))
const HomeActions = lazy(() => import('../components/HomeActions'))
const FeaturedProducts = lazy(() => import('../components/FeaturedProducts'))
const HomeHighlights = lazy(() => import('../components/HomeHighlights'))
const WelcomeModal = lazy(() => import('../components/ui/WelcomeModal'))
const WhatsAppFloating = lazy(() => import('../components/WhatsAppFloating'))
const NotificationBell = lazy(() => import('../components/NotificationBell'))

export default function Home() {
  return (
    <Suspense fallback={null}>
      <WelcomeModal />

      <main className="w-full max-w-6xl mx-auto pb-24 space-y-6">
        <PromoCarousel />
        <HomeActions />
        <section className="px-4">
          <FeaturedProducts />
          <HomeHighlights />
        </section>
      </main>

      <WhatsAppFloating />
      <NotificationBell />
    </Suspense>
  )
}
