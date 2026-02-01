import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser } from '../api/auth'

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const usuario = await getCurrentUser();
                setUser(usuario);
            } catch (error) {
                console.log('Error al verificar sesión:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const value = {
        user,
        setUser,
        loading,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUser debe usarse dentro de UserProvider');
    }

    return context;
}
