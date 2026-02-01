import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { logout } from '../api/auth'
import { FaUsers, FaBoxes, FaUser } from 'react-icons/fa'
import '../Styles/Home.css'

function Home() {
    const { user, setUser, loading } = useUser();
    const navigate = useNavigate();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [loading, user, navigate]);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión. Por favor, intenta de nuevo.');
            setIsLoggingOut(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Cargando datos del usuario...</h2>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="home">
            <header className="home-header">
                <div className="user-info">
                    <div>

                        <h2>
                            <FaUser size={25} />
                            {user.nombre_completo}
                        </h2>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    style={{ background: 'red', color: 'white', border: 'none' }}
                >
                    {isLoggingOut ? 'Cerrando…' : 'Cerrar sesión'}
                </button>
            </header>

            <main className="home-main">
                <h1>Panel principal</h1>

                <div className="cards">
                    <Link to="/ordenes" className="card">
                        < FaBoxes size={25} />
                        <h3> Gestión de Ordenes</h3>
                    </Link>

                    <Link to="/usuarios" className="card">
                        < FaUsers size={25} />
                        <h3> Gestión de Usuaios</h3>
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default Home