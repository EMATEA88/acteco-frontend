import { useEffect, useState } from 'react'
import { api } from '../services/api'
import Toast from '../components/ui/Toast'
import { 
  Megaphone,  
  Link as ArrowRight,
} from '@phosphor-icons/react'

interface Task {
  id: number
  title: string
  description: string
  reward: number
  url?: string
  imageUrl?: string
  instructions?: string
  minSeconds: number
  totalLimit?: number
  completed?: number
}

function getFingerprint() {
  let fp = localStorage.getItem('device_fp')
  if (!fp) {
    fp = crypto.randomUUID()
    localStorage.setItem('device_fp', fp)
  }
  return fp
}

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const MAX_WIDTH = 600
        const scale = MAX_WIDTH / img.width
        canvas.width = MAX_WIDTH
        canvas.height = img.height * scale
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.6))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [proof, setProof] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [, setSubmitting] = useState(false)

  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error'
  })

  function showToast(message: string, type: 'success' | 'error' = 'error') {
    setToast({ visible: true, message, type })
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2500)
  }

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    try {
      const res = await api.get('/tasks')
      setTasks(res.data)
    } catch {
      showToast('Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }

  async function startTask(task: Task) {
    try {
      await api.post(`/tasks/start/${task.id}`, { fingerprint: getFingerprint() })

      if (task.url) {
        let url = task.url.trim()
        if (!url.startsWith('http')) url = 'https://' + url
        window.open(url, '_blank')
      }

      setTimeout(() => {
        setActiveTask(task)
        setTimeLeft(task.minSeconds)
      }, 300)

    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erro ao iniciar tarefa')
    }
  }

  useEffect(() => {
    if (!activeTask || timeLeft <= 0) return
    const interval = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(interval)
  }, [activeTask, timeLeft])

  async function handleImage(e: any) {
    const file = e.target.files[0]
    if (!file) return
    const compressed = await compressImage(file)
    setImage(compressed)
  }

  async function submit() {
    if (!activeTask) return
    if (timeLeft > 0) return showToast(`Aguarde ${timeLeft}s`)

    const finalProof = image || proof
    if (!finalProof) return showToast('Envie uma prova')

    try {
      setSubmitting(true)

      await api.post(`/tasks/complete/${activeTask.id}`, {
        proof: finalProof,
        fingerprint: getFingerprint()
      })

      showToast('Enviado com sucesso', 'success')

      setActiveTask(null)
      setProof('')
      setImage(null)
      await loadTasks()

    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erro')
    } finally {
      setSubmitting(false)
    }
  }

  /* =========================
     LOADING BINANCE STYLE
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 space-y-6 animate-pulse">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-xl"/>
          <div className="w-32 h-4 bg-white/5 rounded"/>
        </div>

        <p className="text-xs text-gray-500">
          Carregando tarefas...
        </p>

        {/* LISTA FAKE */}
        {[1,2,3].map(i => (
          <div key={i} className="glass-card rounded-2xl overflow-hidden">

            <div className="h-32 bg-white/5"/>

            <div className="p-4 space-y-3">
              <div className="h-3 w-32 bg-white/5 rounded"/>
              <div className="h-2 w-40 bg-white/5 rounded"/>
              <div className="h-10 bg-white/5 rounded-xl"/>
            </div>

          </div>
        ))}

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32 space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Megaphone size={20} className="text-emerald-500"/>
        </div>
        <h1 className="text-lg font-semibold">Market Rewards</h1>
      </div>

      {/* LISTA */}
      {tasks.length === 0 && (
        <div className="glass-card p-6 text-center text-gray-500 text-sm">
          Nenhuma tarefa disponível
        </div>
      )}

      {tasks.map(task => {
        const completed = task.completed || 0
        const total = task.totalLimit || 1
        const remaining = total - completed

        return (
          <div key={task.id} className="glass-card rounded-2xl overflow-hidden">

            {task.imageUrl && (
              <img
                src={task.imageUrl}
                className="w-full h-32 object-cover opacity-80"
              />
            )}

            <div className="p-4 space-y-3">

              <div className="flex justify-between">
                <div>
                  <h2 className="text-sm font-medium">{task.title}</h2>
                  <p className="text-xs text-gray-400">{task.description}</p>
                </div>

                <span className="text-emerald-500 text-sm font-semibold">
                  {task.reward} Kz
                </span>
              </div>

              {task.instructions && (
                <div className="text-xs text-gray-400 bg-white/5 p-2 rounded-lg">
                  {task.instructions}
                </div>
              )}

              {task.totalLimit && (
                <div className="text-xs text-gray-500">
                  {remaining} restantes
                </div>
              )}

              <button
                onClick={() => startTask(task)}
                className="w-full h-10 rounded-xl bg-white text-black text-sm font-medium flex items-center justify-center gap-2"
              >
                Executar <ArrowRight size={14}/>
              </button>

            </div>
          </div>
        )
      })}

      {/* MODAL */}
      {activeTask && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50">

          <div className="glass-card p-6 rounded-2xl w-full max-w-md space-y-4">

            <h2 className="text-sm font-semibold text-center">{activeTask.title}</h2>

            <div className="text-center text-xs text-gray-400">
              {timeLeft > 0 ? `Aguarde ${timeLeft}s` : 'Pronto para enviar'}
            </div>

            <input
              value={proof}
              onChange={e => setProof(e.target.value)}
              className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-sm"
            />

            <input type="file" onChange={handleImage} />

            <button
              onClick={submit}
              disabled={timeLeft > 0}
              className="w-full h-10 bg-emerald-500 text-black text-sm font-semibold rounded-xl"
            >
              Finalizar
            </button>

          </div>

        </div>
      )}

      <Toast {...toast} />

    </div>
  )
}