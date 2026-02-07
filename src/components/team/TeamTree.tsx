import { useState } from 'react'

/* =========================
   TYPES
========================= */

export type User = {
  id: number
  phone: string
  createdAt: string
}

type TeamList = {
  level1: User[]
  level2: User[]
  level3: User[]
}

type Props = {
  list: TeamList | null
  loading: boolean
  hasNetwork: boolean
}

/* =========================
   UI ATOMS
========================= */

function Node({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="
        bg-white text-blue-700 px-3 py-2 rounded-xl text-xs shadow
        hover:scale-105 transition whitespace-nowrap
      "
    >
      {label}
    </button>
  )
}

function Connector({ height = 40 }: { height?: number }) {
  return (
    <svg width="120" height={height}>
      <line
        x1="60"
        y1="0"
        x2="60"
        y2={height}
        stroke="#ffffff"
        strokeWidth="2"
        opacity="0.6"
      />
    </svg>
  )
}

/* =========================
   MODAL — HISTÓRICO
   (pronto para integrar
    /commission/history)
========================= */

function TeamHistory({
  user,
  onClose,
}: {
  user: User | null
  onClose: () => void
}) {
  if (!user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-5 w-80 text-blue-700">
        <p className="font-semibold mb-2">Convidado</p>

        <p className="text-sm">
          📱 <b>{user.phone}</b>
        </p>

        <p className="text-xs mt-1 opacity-80">
          Criado em:{' '}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>

        {/* 🔮 FUTURO: comissão + atividade */}
        <div className="mt-3 text-xs opacity-70">
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl text-sm"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}

/* =========================
   MAIN COMPONENT
========================= */

export default function TeamTree({
  list,
  loading,
  hasNetwork,
}: Props) {
  const [selected, setSelected] = useState<User | null>(null)

  /* =====================
     ESTADOS DE CONTROLE
  ===================== */

  if (loading) {
    return (
      <div className="mt-8 text-sm opacity-60 text-center">
        Carregando rede…
      </div>
    )
  }

  if (!hasNetwork) {
    return (
      <div className="mt-8 text-sm opacity-60 text-center">
        Ainda não há convidados na sua rede
      </div>
    )
  }

  if (!list) return null

  /* =====================
     RENDER
  ===================== */

  return (
    <div className="mt-10 overflow-x-auto">
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-6">

          {/* ========== LEVEL 1 ========== */}
          {list.level1.length > 0 && (
            <div className="flex gap-4 flex-wrap justify-center">
              {list.level1.map(user => (
                <Node
                  key={user.id}
                  label={`L1 • ${user.phone}`}
                  onClick={() => setSelected(user)}
                />
              ))}
            </div>
          )}

          {list.level2.length > 0 && <Connector />}

          {/* ========== LEVEL 2 ========== */}
          {list.level2.length > 0 && (
            <div className="flex gap-4 flex-wrap justify-center">
              {list.level2.map(user => (
                <Node
                  key={user.id}
                  label={`L2 • ${user.phone}`}
                  onClick={() => setSelected(user)}
                />
              ))}
            </div>
          )}

          {list.level3.length > 0 && <Connector />}

          {/* ========== LEVEL 3 ========== */}
          {list.level3.length > 0 && (
            <div className="flex gap-4 flex-wrap justify-center">
              {list.level3.map(user => (
                <Node
                  key={user.id}
                  label={`L3 • ${user.phone}`}
                  onClick={() => setSelected(user)}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* =====================
         MODAL — HISTÓRICO
      ===================== */}
      <TeamHistory
        user={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
