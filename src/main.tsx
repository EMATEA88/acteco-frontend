import React from "react"
import ReactDOM from "react-dom/client"
import { HashRouter } from "react-router-dom"
import App from "./App"
import { Toaster } from "sonner"
import "./index.css"
import { registerSW } from "virtual:pwa-register"
import { NotificationProvider } from "./contexts/NotificationContext"

registerSW({
  immediate: true,
  onNeedRefresh() {
    window.location.reload()
  },
  onOfflineReady() {
    console.log("PWA pronta para offline")
  }
})

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <HashRouter>
      <NotificationProvider>
        <App />
        <Toaster
          position="top-right"
          richColors
          theme="dark"
        />
      </NotificationProvider>
    </HashRouter>
  </React.StrictMode>
)