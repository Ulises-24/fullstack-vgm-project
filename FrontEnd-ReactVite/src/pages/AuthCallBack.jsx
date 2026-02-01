import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import {
    authenticateWithGoogle,
    authenticateWithMicrosoft
} from '../api/auth'

function AuthCallBack() {
    const [status, setStatus] = useState('Procesando autenticación...')
    const [error, setError] = useState(null)

    const navigate = useNavigate()
    const { setUser } = useUser()

    useEffect(() => {
        const processAuthCallBack = async () => {
            try {
                const params = new URLSearchParams(window.location.search)
                const code = params.get('code')

                if (!code) {
                    throw new Error('Código de autorización no encontrado')
                }

                const provider = sessionStorage.getItem('authProvider')

                if (!provider) {
                    throw new Error('Proveedor de autenticación no encontrado')
                }

                setStatus(`Autenticando con ${provider}...`)

                let usuario

                if (provider === 'google') {
                    usuario = await authenticateWithGoogle(code)
                } else if (provider === 'microsoft') {
                    usuario = await authenticateWithMicrosoft(code)
                }

                setUser(usuario)

                sessionStorage.removeItem('authProvider')

                setStatus('¡Autenticación exitosa! Redirigiendo...')

                setTimeout(() => {
                    navigate('/home')
                }, 1000)
            } catch (error) {
                console.log('Error en callback:', error)
                setError(error.message)
                setStatus('Error en la autenticación')
            }
        }

        processAuthCallBack()
    }, [navigate, setUser]);

    return (
        <div>
            <h2>{status}</h2>
            {error && (
                <p style={{ color: 'red' }}>
                    Error: {error}
                </p>
            )}
        </div>
    );
}

export default AuthCallBack