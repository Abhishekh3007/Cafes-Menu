import Hero from '@/components/Hero'
import FeaturedCategories from '@/components/FeaturedCategories'
import PopularItems from '@/components/PopularItems'
import SpecialOffer from '@/components/SpecialOffer'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brown-900 to-brown-800">
      <Hero />
      <FeaturedCategories />
      <PopularItems />
      <SpecialOffer />
      <Footer />
    </main>
  )
}
