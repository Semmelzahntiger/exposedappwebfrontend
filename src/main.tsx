import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/roboto-mono'
import '@fontsource-variable/material-symbols-rounded'
import './index.css'
import App from './App.tsx'
import {NotificationProvider} from "./provider/NotificationProvider.tsx";
import {AuthProvider} from "./provider/AuthProvider.tsx";
import {WebSocketProvider} from "./provider/WebSocketProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <NotificationProvider>
              <AuthProvider>
                  <WebSocketProvider>
                      <App />
                  </WebSocketProvider>
              </AuthProvider>
          </NotificationProvider>
      </BrowserRouter>
  </StrictMode>,
)
