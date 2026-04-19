/* =========================
   BASE
========================= */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white/5 animate-pulse rounded ${className}`}
    />
  )
}

/* =========================
   LINHA
========================= */
export function SkeletonLine({ w = "w-full", h = "h-3" }: { w?: string, h?: string }) {
  return <Skeleton className={`${w} ${h}`} />
}

/* =========================
   CARD
========================= */
export function SkeletonCard() {
  return (
    <div className="glass-card p-4 rounded-2xl space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  )
}

/* =========================
   HEADER
========================= */
export function SkeletonHeader() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <Skeleton className="w-32 h-4" />
    </div>
  )
}

/* =========================
   PAGE
========================= */
export function SkeletonPage({
  title = "Carregando..."
}: {
  title?: string
}) {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 space-y-6 animate-pulse">

      <SkeletonHeader />

      <p className="text-xs text-gray-500">{title}</p>

      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />

    </div>
  )
}