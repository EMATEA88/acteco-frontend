import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

function getBaseUrl() {
  const url = import.meta.env.VITE_API_URL || "http://localhost:3333"
  return url.replace(/\/api$/, "")
}

export function connectSocket(token: string): Socket {

  if (socket && socket.connected) return socket

  socket = io(getBaseUrl(), {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  })

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket?.id)
  })

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected")
  })

  socket.on("connect_error", (err) => {
    console.error("Socket error:", err.message)
  })

  return socket
}

export function getSocket(): Socket | null {
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}