import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export function connectSocket(token: string): Socket {

  if (socket?.connected) {
    return socket
  }

  socket = io(
    import.meta.env.VITE_API_URL || "http://localhost:3333",
    {
      transports: ["websocket"], // força websocket
      autoConnect: false,
      withCredentials: true,
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    }
  )

  socket.connect()

  socket.on("connect_error", (err) => {
    console.error("Socket error:", err.message)
  })

  socket.on("disconnect", (reason) => {
    console.warn("Socket disconnected:", reason)
  })

  return socket
}

export function getSocket(): Socket | null {
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}