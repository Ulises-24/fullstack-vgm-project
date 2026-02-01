const API_BASE_URL = 'http://localhost:3000/api';
export const getGoogleAuthUrl = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/google/url`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener URL de Google');
    }

    const data = await response.json();

    if (!data.success || !data.data.url) {
        throw new Error('URL de Google no disponible');
    }

    return data.data.url;
};

export const getMicrosoftAuthUrl = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/microsoft/url`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener URL de Microsoft');
    }

    const data = await response.json();

    if (!data.success || !data.data.url) {
        throw new Error('URL de Microsoft no disponible');
    }

    return data.data.url;
};

export const authenticateWithGoogle = async (code) => {
    const response = await fetch(`${API_BASE_URL}/auth/google/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code }),
    });

    if (!response.ok) {
        throw new Error('Error al autenticar con Google');
    }

    const data = await response.json();

    if (!data.success || !data.data.usuario) {
        throw new Error(data.message || 'Error al autenticar con Google');
    }

    return data.data.usuario;
};

export const authenticateWithMicrosoft = async (code) => {
    const response = await fetch(`${API_BASE_URL}/auth/microsoft/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code }),
    });

    if (!response.ok) {
        throw new Error('Error al autenticar con Microsoft');
    }

    const data = await response.json();

    if (!data.success || !data.data.usuario) {
        throw new Error(data.message || 'Error al autenticar con Microsoft');
    }

    return data.data.usuario;
};

export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Error al cerrar sesión');
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (!data.success || !data.data || !data.data.usuario) {
            return null;
        }

        return data.data.usuario;

    } catch (error) {
        console.error('Error al obtener usuario actual:', error);
        return null;
    }
};

