import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselImages = [
  { src: "B1.PNG", label: "Gestão Inteligente: ENDE" },
  { src: "B2.PNG", label: "Unitel Money: Serviços e Voz" },
  { src: "B3.PNG", label: "Tecnologia: Conexão Global" },
  { src: "B4.PNG", label: "Infraestrutura Profissional" },
  { src: "B5.PNG", label: "Pagamentos: Multicaixa TPA" },
  { src: "B6.PNG", label: "Serviços Financeiros" },
  { src: "B7.PNG", label: "Design e Identidade" },
  { src: "B8.PNG", label: "DStv Fácil: TV para Todos" },
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Movimento automático a cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  return (
    <div className="relative h-[220px] rounded-3xl overflow-hidden border border-cyan-500/20 shadow-[0_15px_30px_rgba(10,37,51,0.5)] mb-12 bg-[#0e364a]">
      {/* Contêiner das Imagens com Animação de Slide */}
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {carouselImages.map((image, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img
              src={image.src}
              alt={image.label}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Sobreposição de Gradiente para o Texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a2533]/90 via-[#0a2533]/40 to-transparent" />
            {/* Texto do Cartão */}
            <div className="absolute bottom-4 left-5 right-5 z-10">
              <h3 className="text-base font-black text-white tracking-tight truncate font-mono uppercase">
                {image.label}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Pontos de Navegação (Dots) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              h-1.5 rounded-full transition-all duration-300 cursor-pointer
              ${currentIndex === index ? "bg-cyan-400 w-3 shadow-sm shadow-cyan-400/50" : "bg-cyan-200/40 w-1.5"}
            `}
          />
        ))}
      </div>

      {/* Setas de Navegação */}
      <button
        onClick={goToPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[#0a2533]/70 border border-cyan-500/20 text-cyan-200 hover:bg-[#0e364a] hover:text-white z-20 transition cursor-pointer shadow-sm"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[#0a2533]/70 border border-cyan-500/20 text-cyan-200 hover:bg-[#0e364a] hover:text-white z-20 transition cursor-pointer shadow-sm"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}