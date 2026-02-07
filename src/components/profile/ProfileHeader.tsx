interface Props {
  phone: string
  userId: number
  inviteCode: string
}

export default function ProfileHeader({ phone, userId, inviteCode }: Props) {
  return (
    <div className="bg-green-600 px-6 pt-10 pb-24 relative text-white">
      <div className="flex items-center gap-4">
        {/* AVATAR */}
        <div className="w-16 h-16 rounded-full bg-white overflow-hidden shadow">
          <img
            src="/logo.png"
            alt="Acteco"
            className="w-full h-full object-cover"
          />
        </div>

        {/* INFO */}
        <div className="leading-tight">
          <p className="text-sm font-medium">{phone}</p>

          <p className="text-xs opacity-90 mt-1">
            ID: <span className="font-semibold">{userId}</span>
          </p>

          <p className="text-xs opacity-90">
            Código convite:{' '}
            <span className="font-semibold">{inviteCode}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
