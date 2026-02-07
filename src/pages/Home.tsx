import { lazy, Suspense } from 'react'

import WelcomeModal from '../components/ui/WelcomeModal'
import WhatsAppFloating from '../components/WhatsAppFloating'
import NotificationBell from '../components/NotificationBell'

const PromoCarousel = lazy(() => import('../components/PromoCarousel'))
const HomeActions = lazy(() => import('../components/HomeActions'))
const FeaturedProducts = lazy(() => import('../components/FeaturedProducts'))
const HomeHighlights = lazy(() => import('../components/HomeHighlights'))

export default function Home() {
  return (
    <>
      {/* COMPONENTE CRÍTICO — SEM LAZY */}
      <WelcomeModal />

      <main className="w-full max-w-6xl mx-auto pb-24 space-y-6">
        <Suspense fallback={null}>
          <PromoCarousel />
        </Suspense>

        <Suspense fallback={null}>
          <HomeActions />
        </Suspense>

        <section className="px-4">
          <Suspense fallback={null}>
            <FeaturedProducts />
            <HomeHighlights />
          </Suspense>
        </section>
      </main>

      {/* FLOATING — SEM LAZY */}
      <WhatsAppFloating />
      <NotificationBell />
    </>
  )
}
