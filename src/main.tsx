import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { Toaster } from "sonner"
import "./index.css"
import { NotificationProvider } from "./contexts/NotificationContext"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
})

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NotificationProvider>
          <App />
          <Toaster
  position="top-center"
  richColors
  theme="dark"
  // Na Sonner, usamos o 'style' direto para o container global
  style={{ 
    marginTop: '3.5rem',
    zIndex: 99999 
  }}
  toastOptions={{
    // Isso garante que o card interno do toast também herde o estilo se necessário
    style: { 
      textAlign: 'center' 
    },
  }}
/>
        </NotificationProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)