import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { Toaster } from "sonner"
import "./index.css"
import { NotificationProvider } from "./contexts/NotificationContext"

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <App />
        <Toaster
          position="top-right"
          richColors
          theme="dark"
        />
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
)