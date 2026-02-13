import type { SupportMessage } from './support.types'

interface Props {
  message: SupportMessage
  currentUserId: number
}

export default function MessageBubble({ message, currentUserId }: Props) {
  const isMine = message.senderId === currentUserId

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-xs p-3 rounded-xl text-sm ${
          isMine ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        {message.type === 'TEXT' && <p>{message.content}</p>}

        {message.type === 'IMAGE' && (
          <img src={message.content} className="rounded-lg max-w-full" />
        )}

        {message.type === 'AUDIO' && (
          <audio controls src={message.content} />
        )}
      </div>
    </div>
  )
}
