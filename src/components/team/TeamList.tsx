import { useState, useCallback } from 'react'
import TeamHistory from './TeamHistory'

type User = {
  id: number
  phone: string
  createdAt: string
}

type LevelKey = 'level1' | 'level2' | 'level3'

type Props = {
  list: {
    level1: User[]
    level2: User[]
    level3: User[]
  }
  tab: LevelKey
  loading: boolean
  hasNetwork: boolean
}

export default function TeamList({
  list,
  tab,
  loading,
  hasNetwork,
}: Props) {
  const [selectedUser, setSelectedUser] =
    useState<User | null>(null)

  const openUser = useCallback((u: User) => {
    setSelectedUser(u)
  }, [])

  const closeUser = useCallback(() => {
    setSelectedUser(null)
  }, [])

  if (loading) {
    return (
      <div className="mt-4 text-sm text-gray-500">
        A carregar…
      </div>
    )
  }

  if (!hasNetwork) {
    return (
      <div className="mt-4 text-sm text-gray-500">
        Ainda não possui equipa
      </div>
    )
  }

  const currentList = list[tab]

  if (currentList.length === 0) {
    return (
      <div className="mt-4 text-sm text-gray-500">
        Nenhum utilizador neste nível
      </div>
    )
  }

  return (
    <>
      <div
        className="
          mt-4
          max-h-[55vh]
          overflow-y-auto
          space-y-3
          pr-1
        "
      >
        {currentList.map(u => (
          <button
            key={u.id}
            onClick={() => openUser(u)}
            className="
              w-full text-left
              bg-white rounded-xl p-4
              shadow-sm
              hover:bg-emerald-50
              active:scale-[0.99]
              transition
            "
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {u.phone}
              </p>

              <span className="text-[11px] text-gray-400">
                ID #{String(u.id).padStart(8, '0')}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Registado em{' '}
              {new Date(u.createdAt).toLocaleDateString()}
            </p>
          </button>
        ))}
      </div>

      {selectedUser && (
        <TeamHistory
          user={selectedUser}
          onClose={closeUser}
        />
      )}
    </>
  )
}
