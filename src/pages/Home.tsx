import PromoCarousel from '../components/PromoCarousel'
import HomeActions from '../components/HomeActions'
import FeaturedProducts from '../components/FeaturedProducts'
import WelcomeModal from '../components/ui/WelcomeModal'
import WhatsAppFloating from '../components/WhatsAppFloating'
import NotificationBell from '../components/NotificationBell'

export default function Home() {
  return (
    <>
      <WelcomeModal />
      <PromoCarousel />
      <HomeActions />
      <FeaturedProducts />
      <WhatsAppFloating />
      <NotificationBell />
    </>
  )
}
