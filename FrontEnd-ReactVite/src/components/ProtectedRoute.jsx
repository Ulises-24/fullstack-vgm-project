import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function ProtectedRoute({ children }) {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <h2>Verificando sesión...</h2>
                <p>Por favor espera un momento</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default ProtectedRoute;