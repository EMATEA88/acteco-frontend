import { useEffect, useState } from 'react'
import { api } from '../services/api'
import Toast from '../components/ui/Toast'
import { 
  Megaphone, 
  Clock, 
  Camera, 
  Link as LinkIcon, 
  CheckCircle, 
  X, 
  ArrowRight,
  MonitorPlay,
  Info
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

/* =========================
   DEVICE FINGERPRINT
========================= */
function getFingerprint() {
  let fp = localStorage.getItem('device_fp')
  if (!fp) {
    fp = crypto.randomUUID()
    localStorage.setItem('device_fp', fp)
  }
  return fp
}

/* =========================
   COMPRESS IMAGE
========================= */
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const MAX_WIDTH = 600 // Aumentado um pouco para melhor qualidade em auditoria
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
  const [previewImage, setPreviewImage] = useState<string | null>(null)

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
      showToast('Erro ao carregar ecossistema de tarefas')
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
      showToast(err.response?.data?.error || 'Não foi possível iniciar esta tarefa')
    }
  }

  useEffect(() => {
    if (!activeTask || timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
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
    if (timeLeft > 0) return showToast(`Aguarde mais ${timeLeft}s`)
    const finalProof = image || proof
    if (!finalProof) return showToast('Anexe uma captura de ecrã ou link como prova')

    try {
      setSubmitting(true)
      await api.post(`/tasks/complete/${activeTask.id}`, {
        proof: finalProof,
        fingerprint: getFingerprint()
      })
      setTasks(prev => prev.map(t => t.id === activeTask.id ? { ...t, completed: (t.completed || 0) + 1 } : t))
      showToast('Tarefa enviada para auditoria', 'success')
      setActiveTask(null); setProof(''); setImage(null)
      await loadTasks()
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erro ao processar envio')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
          <Megaphone size={24} weight="duotone" />
        </div>
        <h1 className="text-xl font-black tracking-tighter uppercase">Market Rewards</h1>
      </header>

      <main className="max-w-xl mx-auto px-4 mt-6 space-y-6">
        {tasks.length === 0 && (
          <div className="text-center py-20 opacity-30 flex flex-col items-center">
            <MonitorPlay size={48} weight="thin" className="mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest">Nenhuma campanha ativa</p>
          </div>
        )}

        {tasks.map(task => {
          const completed = task.completed || 0
          const total = task.totalLimit || 1
          const percent = Math.min((completed / total) * 100, 100)
          const remaining = Math.max(total - completed, 0)

          return (
            <div key={task.id} className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-green-500/20 group">
              {task.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden bg-black">
                   <img
                    src={task.imageUrl}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => setPreviewImage(task.imageUrl!)}
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black text-green-500 uppercase">
                    Ref: #{task.id}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-black tracking-tight leading-tight">{task.title}</h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">{task.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-green-500 tracking-tighter italic">{task.reward}<span className="text-[10px] not-italic ml-1">Kz</span></p>
                  </div>
                </div>

                {task.instructions && (
                  <div className="bg-white/5 p-4 rounded-2xl flex items-start gap-3">
                    <Info size={16} className="text-gray-400 mt-0.5" />
                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                      {task.instructions}
                    </p>
                  </div>
                )}

                {task.totalLimit && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                      <span className="text-gray-600">Disponibilidade</span>
                      <span className="text-red-500">{remaining} RESTANTES</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${percent > 85 ? 'bg-red-500' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => startTask(task)}
                  className="w-full h-14 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Executar Tarefa
                  <ArrowRight size={18} weight="bold" />
                </button>
              </div>
            </div>
          )
        })}
      </main>

      {/* MODAL DE ENVIO (UPGRADE PARA PREMIUM) */}
      {activeTask && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[60] p-6 animate-in fade-in duration-300">
          <div className="bg-[#111] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative">
            <button onClick={() => setActiveTask(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              <X size={24} weight="bold" />
            </button>

            <div className="text-center space-y-2 mb-8">
              <h2 className="text-xl font-black tracking-tight">{activeTask.title}</h2>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                <Clock size={16} weight="fill" className={timeLeft > 0 ? "text-yellow-500 animate-spin" : "text-green-500"} />
                <span className="text-xs font-bold text-white uppercase tracking-widest">
                  {timeLeft > 0 ? `Aguarde: ${timeLeft}s` : 'Protocolo Pronto'}
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 ml-1 flex items-center gap-2">
                  <LinkIcon size={14} /> Link da Prova (Opcional)
                </label>
                <input
                  value={proof}
                  onChange={e => setProof(e.target.value)}
                  placeholder="https://suaprova.com"
                  className="w-full h-14 bg-[#0a0a0a] border border-white/5 rounded-2xl px-5 text-sm text-white focus:border-green-500/40 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 ml-1 flex items-center gap-2">
                  <Camera size={14} /> Captura de Ecrã (Screenshot)
                </label>
                <div className="relative h-32 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center bg-[#0a0a0a] overflow-hidden group hover:border-green-500/20 transition-all">
                  {!image ? (
                    <div className="text-center">
                      <Camera size={32} weight="thin" className="mx-auto text-gray-700 group-hover:text-green-500 transition-colors" />
                      <p className="text-[9px] font-bold text-gray-700 uppercase mt-2">Clique para carregar prova</p>
                    </div>
                  ) : (
                    <img src={image} className="w-full h-full object-cover" />
                  )}
                  <input type="file" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <button
                onClick={submit}
                disabled={timeLeft > 0 || submitting}
                className="w-full h-16 rounded-2xl bg-green-600 text-white font-black text-sm uppercase tracking-widest hover:bg-green-500 shadow-lg shadow-green-900/20 active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3 transition-all"
              >
                {submitting ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Finalizar & Receber <CheckCircle size={22} weight="fill" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW IMAGE MODAL */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[70] p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-full max-h-full">
            <button className="absolute -top-12 right-0 text-white flex items-center gap-2 text-xs font-bold uppercase">
               Fechar <X size={20} />
            </button>
            <img src={previewImage} className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}

      <Toast visible={toast.visible} message={toast.message} type={toast.type} />
    </div>
  )
}