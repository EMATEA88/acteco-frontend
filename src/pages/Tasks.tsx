import { useEffect, useState } from 'react'
import { api } from '../services/api'
import Toast from '../components/ui/Toast'

interface Task {
  id: number
  title: string
  description: string
  reward: number
  url?: string
  imageUrl?: string
  instructions?: string
  minSeconds: number
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

        const MAX_WIDTH = 400
        const scale = MAX_WIDTH / img.width

        canvas.width = MAX_WIDTH
        canvas.height = img.height * scale

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

        resolve(canvas.toDataURL('image/jpeg', 0.4))
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

  // ✅ TOAST
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
    await api.post(`/tasks/start/${task.id}`, {
      fingerprint: getFingerprint()
    })

    setActiveTask(task)
    setTimeLeft(task.minSeconds)

    if (task.url) {
      let url = task.url.trim()

      if (!url.startsWith('http')) {
        url = 'https://' + url
      }

      // 🚨 DETECTA FACEBOOK
      const isFacebook = url.includes('facebook.com')

      if (isFacebook) {
        // força abrir fora do webview
        window.location.href = url
        return
      }

      // normal
      const newWindow = window.open(url, '_blank')

      if (!newWindow) {
        window.location.href = url
      }
    }

  } catch (err: any) {
    showToast(err.response?.data?.error || 'Erro')
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

    if (timeLeft > 0) {
      return showToast('Aguarde o tempo terminar')
    }

    const finalProof = image || proof

    if (!finalProof) {
      return showToast('Envie prova')
    }

    try {
      setSubmitting(true)

      await api.post(`/tasks/complete/${activeTask.id}`, {
        proof: finalProof,
        fingerprint: getFingerprint()
      })

      showToast('Enviado para revisão', 'success')

      setActiveTask(null)
      setProof('')
      setImage(null)

      loadTasks()

    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erro')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-4 text-white">Carregando...</div>

  return (
    <div className="text-white bg-[#0B0E11] min-h-screen">

      <h1 className="text-xl p-4">Marketing</h1>

      {/* EMPTY STATE */}
      {tasks.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          Nenhuma tarefa disponível
        </div>
      )}

      {tasks.map(task => (
        <div key={task.id} className="mb-4">

          {/* ✅ IMAGEM FULL (SEM ESPAÇO LATERAL) */}
          {task.imageUrl && (
            <img
              src={task.imageUrl}
              className="w-full h-auto object-contain bg-black cursor-pointer"
              onClick={() => setPreviewImage(task.imageUrl!)}
            />
          )}

          <div className="p-4 bg-[#1E2329] border-t border-[#2B3139]">

            <h2 className="font-bold">{task.title}</h2>
            <p className="text-sm text-gray-400">{task.description}</p>

            {task.instructions && (
              <p className="text-xs mt-2 text-gray-500">
                {task.instructions}
              </p>
            )}

            <p className="text-[#02C076] font-bold mt-2">
              {task.reward} Kz
            </p>

            <button
              onClick={() => startTask(task)}
              className="mt-3 bg-[#FCD535] text-black px-4 py-2 rounded font-bold w-full"
            >
              Fazer
            </button>

          </div>
        </div>
      ))}

      {/* MODAL TASK */}
      {activeTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#1E2329] p-6 rounded-xl w-full max-w-md">

            <h2 className="font-bold mb-2">{activeTask.title}</h2>

            <p className="mb-4 text-yellow-400">
              {timeLeft > 0 ? `Aguarde: ${timeLeft}s` : 'Pode enviar prova'}
            </p>

            <input
              value={proof}
              onChange={e => setProof(e.target.value)}
              placeholder="Link (opcional)"
              className="w-full p-2 mb-3 bg-[#0B0E11] rounded"
            />

            <input type="file" onChange={handleImage} />

            {image && (
              <img src={image} className="mt-2 max-h-40 object-contain rounded" />
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={submit}
                disabled={timeLeft > 0 || submitting}
                className="bg-green-600 px-4 py-2 rounded w-full"
              >
                {submitting ? 'Enviando...' : 'Enviar'}
              </button>

              <button
                onClick={() => setActiveTask(null)}
                className="bg-gray-600 px-4 py-2 rounded w-full"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PREVIEW */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            className="max-w-[95%] max-h-[95%] object-contain"
          />
        </div>
      )}

      {/* TOAST */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />

    </div>
  )
}