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
    <>
      <Suspense fallback={null}>
        <WelcomeModal />
      </Suspense>

      <main className="w-full max-w-6xl mx-auto pb-24 space-y-6">
        {/* HERO / BANNERS */}
        <section>
          <Suspense fallback={<div className="h-40" />}>
            <PromoCarousel />
          </Suspense>
        </section>

        {/* ACTIONS */}
        <section>
          <Suspense fallback={<div className="h-24" />}>
            <HomeActions />
          </Suspense>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="px-4">
          <Suspense fallback={<div className="h-48" />}>
            <FeaturedProducts />
            <HomeHighlights />
          </Suspense>
        </section>
      </main>

      {/* FLOATING ELEMENTS */}
      <Suspense fallback={null}>
        <WhatsAppFloating />
        <NotificationBell />
      </Suspense>
    </>
  )
}
