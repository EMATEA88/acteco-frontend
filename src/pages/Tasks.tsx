import { useEffect, useState } from 'react'
import { api } from '../services/api'
import Toast from '../components/ui/Toast'
import { 
  Megaphone,  
  ArrowSquareOut,
  Image as ImageIcon,
  Clock,
  CheckCircle
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
  const [submitting, setSubmitting] = useState(false)

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
      setLoading(true)
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
    if (!finalProof) return showToast('Envie uma prova (link ou print)')

    try {
      setSubmitting(true)

      await api.post(`/tasks/complete/${activeTask.id}`, {
        proof: finalProof,
        fingerprint: getFingerprint()
      })

      showToast('Tarefa enviada para análise', 'success')
      setActiveTask(null)
      setProof('')
      setImage(null)
      await loadTasks()

    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erro ao enviar')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 space-y-6 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#161A1F] rounded-xl"/>
          <div className="w-32 h-4 bg-[#161A1F] rounded"/>
        </div>
        {[1,2].map(i => (
          <div key={i} className="bg-[#161A1F] rounded-3xl h-64 overflow-hidden border border-white/5" />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32 space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
          <Megaphone size={22} className="text-cyan-400"/>
        </div>
        <h1 className="text-xl font-medium tracking-tight">Market Rewards</h1>
      </div>

      {/* LISTA DE TAREFAS */}
      <div className="space-y-6">
        {tasks.length === 0 && (
          <div className="bg-[#161A1F] p-10 rounded-3xl text-center border border-white/5">
            <p className="text-sm text-gray-500">Nenhuma campanha ativa no momento</p>
          </div>
        )}

        {tasks.map(task => {
          const completed = task.completed || 0
          const total = task.totalLimit || 1
          const remaining = total - completed
          const hasUniqueInstructions = task.instructions && task.instructions !== task.description

          return (
            <div key={task.id} className="bg-[#161A1F] rounded-3xl overflow-hidden border border-white/5 shadow-lg transition-all">
              
              {task.imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden border-b border-white/5">
                  <img
                    src={task.imageUrl}
                    className="w-full h-full object-cover opacity-80"
                    alt="Task Preview"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161A1F] to-transparent opacity-40" />
                </div>
              )}

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-base font-medium text-white mb-1">
                      {task.title}
                    </h2>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-semibold text-cyan-400">
                      {task.reward} Kz
                    </span>
                  </div>
                </div>

                {hasUniqueInstructions && (
                  <div className="text-xs text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5">
                    {task.instructions}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  {task.totalLimit ? (
                    <span className="text-xs text-gray-500">
                      {remaining} restantes
                    </span>
                  ) : <span />}

                  <button
                    onClick={() => startTask(task)}
                    className="px-6 h-10 rounded-xl bg-white text-black text-sm font-medium flex items-center gap-2 transition-opacity active:opacity-80"
                  >
                    Executar <ArrowSquareOut size={16} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* MODAL DE SUBMISSÃO */}
      {activeTask && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-[#161A1F] p-8 rounded-3xl w-full max-w-md space-y-6 border border-white/10 shadow-2xl">
            
            <div className="text-center space-y-1">
              <h2 className="text-lg font-medium text-white">Enviar Prova</h2>
              <p className="text-xs text-gray-400">{activeTask.title}</p>
            </div>

            <div className="flex flex-col items-center justify-center py-4 bg-[#0B0E11] rounded-2xl border border-white/5">
              <Clock size={24} className={timeLeft > 0 ? "text-cyan-500 animate-pulse" : "text-emerald-500"} />
              <div className="text-xs text-gray-400 mt-2">
                {timeLeft > 0 ? `Aguarde ${timeLeft}s` : 'Pronto para enviar'}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs text-gray-500 ml-1">Link ou Comentário</p>
                <input
                  value={proof}
                  placeholder="Link do perfil ou post"
                  onChange={e => setProof(e.target.value)}
                  className="w-full h-11 bg-[#0B0E11] border border-white/10 rounded-xl px-4 text-sm text-white outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImage} 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full h-12 border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all ${image ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/5'}`}>
                  {image ? (
                    <><CheckCircle size={18} className="text-emerald-500" /> <span className="text-xs text-emerald-500">Imagem anexada</span></>
                  ) : (
                    <><ImageIcon size={18} className="text-gray-500" /> <span className="text-xs text-gray-500">Anexar Print</span></>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setActiveTask(null)}
                className="flex-1 h-11 rounded-xl bg-white/5 text-sm text-gray-400 border border-white/5"
              >
                Voltar
              </button>
              <button
                onClick={submit}
                disabled={timeLeft > 0 || submitting}
                className={`flex-[2] h-11 rounded-xl text-sm font-medium transition-all
                  ${timeLeft > 0 || submitting 
                    ? 'bg-white/5 text-gray-600' 
                    : 'bg-white text-black active:scale-95'
                  }
                `}
              >
                {submitting ? 'Enviando...' : 'Finalizar'}
              </button>
            </div>

          </div>
        </div>
      )}

      <Toast {...toast} />
    </div>
  )
}