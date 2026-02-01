import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'

import Login from './components/login'
import AuthCallBack from './pages/AuthCallBack'
import Home from './pages/Home'
import Ordenes from './pages/Ordenes'
import Usuarios from './pages/Usuarios'

import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [count, setCount] = useState(0);

  return (
    <UserProvider>

      <BrowserRouter>

        <Routes>

          <Route path='/' element={<Login />} />

          <Route path='/auth/callback' element={<AuthCallBack />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ordenes"
            element={
              <ProtectedRoute>
                <Ordenes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <Usuarios />
              </ProtectedRoute>
            }
          />

        </Routes>

      </BrowserRouter>

    </UserProvider>
  )
}

export default App
