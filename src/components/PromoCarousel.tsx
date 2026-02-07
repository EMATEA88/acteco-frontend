// src/components/PromoCarousel.tsx
import { useEffect, useState } from 'react'

const banners = [
  '/src/assets/banners/home/banner-01.webp',
  '/src/assets/banners/home/banner-02.webp',
  '/src/assets/banners/home/banner-03.webp',
  '/src/assets/banners/home/banner-04.webp',
]

export default function PromoCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const i = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length)
    }, 4000)

    return () => clearInterval(i)
  }, [])

  return (
    <div className="relative w-full h-[220px] overflow-hidden">
      <img
        src={banners[index]}
        className="w-full h-full object-cover transition-opacity duration-700"
        alt="Banner"
      />

      {/* overlay escuro opcional */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  )
}
