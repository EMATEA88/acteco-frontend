import PromoCarousel from '../components/PromoCarousel'
import HomeActions from '../components/HomeActions'
import FeaturedProducts from '../components/FeaturedProducts'
import HomeHighlights from '../components/HomeHighlights'
import WelcomeModal from '../components/ui/WelcomeModal'
import WhatsAppFloating from '../components/WhatsAppFloating'
import NotificationBell from '../components/NotificationBell'

export default function Home() {
  return (
    <>
      <WelcomeModal />

      <main className="w-full max-w-6xl mx-auto pb-24 space-y-6">
        {/* HERO / BANNERS */}
        <section>
          <PromoCarousel />
        </section>

        {/* ACTIONS */}
        <section>
          <HomeActions />
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="px-4">
          <FeaturedProducts />
          <HomeHighlights />
        </section>
      </main>

      {/* FLOATING ELEMENTS */}
      <WhatsAppFloating />
      <NotificationBell />
    </>
  )
}
