import { useEffect, useState } from "react"

const images = Array.from({ length: 26 }, (_, i) =>
  `/assets/marketing/marketing-${i + 1}.webp`
)

export default function Marketing() {

  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  /* BLOQUEAR SCROLL GLOBAL */
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  /* AUTO SLIDER */
  useEffect(() => {
    const interval = setInterval(() => {

      setFade(false)

      setTimeout(() => {
        setIndex(prev => (prev + 1) % images.length)
        setFade(true)
      }, 400)

    }, 4500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-[#0B0E11] text-[#EAECEF] flex flex-col">

      {/* HEADER FIXO */}
      <div className="
        shrink-0
        bg-[#1E2329]
        border-b border-[#2B3139]
        px-8 py-5
      ">
        <h1 className="text-2xl font-semibold">
          Marketing & Publicidade
        </h1>
      </div>

      {/* CONTEÚDO CENTRAL FIXO */}
      <div className="
        flex-1
        flex
        items-center
        justify-center
        px-8
      ">

        <div className="
          relative
          w-full
          max-w-6xl
          h-[72vh]
          rounded-3xl
          overflow-hidden
          border border-[#2B3139]
        ">

          <img
            src={images[index]}
            alt="Marketing"
            className={`
              absolute inset-0
              w-full
              h-full
              object-cover
              transition-opacity duration-700
              ${fade ? "opacity-100" : "opacity-0"}
            `}
          />

        </div>

      </div>

      {/* INDICADORES */}
      <div className="
        shrink-0
        flex
        justify-center
        gap-2
        pb-6
      ">
        {images.slice(0, 6).map((_, i) => (
          <div
            key={i}
            className={`
              h-1.5 w-8 rounded-full transition-all
              ${index % 6 === i
                ? "bg-[#FCD535]"
                : "bg-[#2B3139]"}
            `}
          />
        ))}
      </div>

    </div>
  )
}