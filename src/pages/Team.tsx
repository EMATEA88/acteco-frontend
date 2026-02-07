import { useEffect, useState } from 'react'
import { TeamService } from '../services/team.service'
import { CommissionService } from '../services/commission.service'

import TeamStats from '../components/team/TeamStats'
import TeamEarnings from '../components/team/TeamEarnings'
import TeamList from '../components/team/TeamList'
import InviteBox from '../components/team/InviteBox'

/* ================= TYPES ================= */

type LevelKey = 'level1' | 'level2' | 'level3'

type TeamSummary = {
  level1: number
  level2: number
  level3: number
  total: number
}

type TeamEarningsSummary = {
  level1: number
  level2: number
  level3: number
  total: number
}

type TeamMember = {
  id: number
  phone: string
  createdAt: string
}

type TeamListGrouped = {
  level1: TeamMember[]
  level2: TeamMember[]
  level3: TeamMember[]
}

/* ================= PAGE ================= */

export default function Team() {
  const [summary, setSummary] =
    useState<TeamSummary | null>(null)

  const [list, setList] =
    useState<TeamListGrouped>({
      level1: [],
      level2: [],
      level3: [],
    })

  const [earnings, setEarnings] =
    useState<TeamEarningsSummary | null>(null)

  const [tab, setTab] =
    useState<LevelKey>('level1')

  const [loading, setLoading] =
    useState<boolean>(true)

  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  )

  const inviteLink =
    `${window.location.origin}/register?invite=${user.inviteCode}`

  /* ================= DATA LOAD ================= */

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const [summaryRes, listRes, earningsRes] =
          await Promise.allSettled([
            TeamService.getSummary(),
            TeamService.getList(),
            CommissionService.getSummary(),
          ])

        if (!mounted) return

        if (summaryRes.status === 'fulfilled') {
          setSummary(summaryRes.value.data)
        }

        if (listRes.status === 'fulfilled') {
          setList(listRes.value.data)
        }

        if (earningsRes.status === 'fulfilled') {
          setEarnings(earningsRes.value.data)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const hasNetwork: boolean =
    !!summary &&
    (summary.level1 > 0 ||
      summary.level2 > 0 ||
      summary.level3 > 0)

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen pb-28 bg-gradient-to-b from-emerald-50 to-white animate-fadeZoom">
      {/* ================= HEADER ================= */}
      <div className="px-5 pt-8">
        <h1 className="text-xl font-semibold text-gray-900">
          Minha Equipa
        </h1>
      </div>

      {/* ================= STATS ================= */}
      <div className="px-5 mt-6 space-y-4">
        <TeamStats summary={summary} />
        <TeamEarnings earnings={earnings} />
      </div>

      {/* ================= TABS ================= */}
      <div className="px-5 mt-8">
        <div className="bg-white rounded-2xl p-1 shadow-card flex">
          {(['level1', 'level2', 'level3'] as LevelKey[]).map(l => (
            <button
              key={l}
              onClick={() => setTab(l)}
              className={`
                flex-1 py-2 text-sm font-medium rounded-xl
                transition-all duration-200
                ${
                  tab === l
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow'
                    : 'text-gray-500 hover:bg-gray-100'
                }
              `}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ================= LIST ================= */}
      <div className="px-5 mt-6">
        <div className="bg-white rounded-2xl shadow-card p-4">
          <TeamList
            list={list}
            tab={tab}
            loading={loading}
            hasNetwork={hasNetwork}
          />
        </div>
      </div>

      {/* ================= INVITE ================= */}
      <div className="px-5 mt-8">
        <InviteBox inviteLink={inviteLink} />
      </div>
    </div>
  )
}
