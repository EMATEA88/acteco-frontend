import { useEffect, useState } from 'react'
import { api } from '../services/api'

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

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [proof, setProof] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    const res = await api.get('/tasks')
    setTasks(res.data)
    setLoading(false)
  }

  // ==========================================
  // INICIAR TASK
  // ==========================================
  async function startTask(task: Task) {
    try {
      await api.post(`/tasks/start/${task.id}`)

      setActiveTask(task)
      setTimeLeft(task.minSeconds)

      // 🔥 abre automaticamente
      if (task.url) {
        window.open(task.url, '_blank')
      }

    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro')
    }
  }

  // ==========================================
  // TIMER
  // ==========================================
  useEffect(() => {
    if (!activeTask || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [activeTask, timeLeft])

  // ==========================================
  // IMAGEM
  // ==========================================
  function handleImage(e: any) {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onloadend = () => {
      setImage(reader.result as string)
    }

    if (file) reader.readAsDataURL(file)
  }

  // ==========================================
  // ENVIAR PROVA
  // ==========================================
  async function submit() {
    if (!activeTask) return

    if (timeLeft > 0) {
      alert('Aguarde o tempo terminar')
      return
    }

    const finalProof = image || proof

    if (!finalProof) {
      alert('Envie prova')
      return
    }

    try {
      setSubmitting(true)

      await api.post(`/tasks/complete/${activeTask.id}`, {
        proof: finalProof
      })

      alert('Enviado para revisão')

      setActiveTask(null)
      setProof('')
      setImage(null)

      loadTasks()

    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-4 text-white">Carregando...</div>

  return (
    <div className="p-4 text-white bg-[#0B0E11] min-h-screen">

      <h1 className="text-xl mb-4">Marketing</h1>

      {/* ===================== */}
      {/* LISTA */}
      {/* ===================== */}
      {tasks.map(task => (
        <div key={task.id} className="bg-[#1E2329] border border-[#2B3139] p-4 rounded-xl mb-3">

          {task.imageUrl && (
            <img
              src={task.imageUrl}
              className="w-full h-40 object-cover rounded mb-2"
            />
          )}

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
            className="mt-3 bg-[#FCD535] text-black px-4 py-2 rounded font-bold"
          >
            Fazer
          </button>
        </div>
      ))}

      {/* ===================== */}
      {/* MODAL */}
      {/* ===================== */}
      {activeTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-[#1E2329] p-6 rounded-xl w-full max-w-md">

            <h2 className="font-bold mb-2">
              {activeTask.title}
            </h2>

            {/* TIMER */}
            {timeLeft > 0 ? (
              <p className="text-yellow-400 mb-4">
                Aguarde: {timeLeft}s
              </p>
            ) : (
              <p className="text-green-400 mb-4">
                Pode enviar prova
              </p>
            )}

            <input
              value={proof}
              onChange={e => setProof(e.target.value)}
              placeholder="Link (opcional)"
              className="w-full p-2 mb-3 bg-[#0B0E11] rounded"
            />

            <input type="file" onChange={handleImage} />

            {image && (
              <img
                src={image}
                className="mt-2 h-32 rounded"
              />
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

    </div>
  )
}