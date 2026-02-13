// src/components/PromoCarousel.tsx
import { useEffect, useState } from 'react'

const banners = [
  '/banners/home/banner-01.webp',
  '/banners/home/banner-02.webp',
  '/banners/home/banner-03.webp',
  '/banners/home/banner-04.webp',
  '/banners/home/banner-05.webp',
  '/banners/home/banner-06.webp',
  '/banners/home/banner-07.webp',
  '/banners/home/banner-08.webp',
]

export default function PromoCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length)
    }, 4500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[200px] md:h-[240px] overflow-hidden">
      <img
        key={banners[index]}
        src={banners[index]}
        alt="ACTECO promotion banner"
        className="
          w-full h-full object-cover
          transition-opacity duration-700 ease-in-out
        "
      />

      {/* overlay profissional */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
    </div>
  )
}
