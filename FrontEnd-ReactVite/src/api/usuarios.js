const API_BASE_URL = 'http://localhost:3000/api';

export const getUsuarios = async () => {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Error al obtener usuarios');
    }

    const data = await response.json();
    return data.data;
};

export const createUsuario = async (usuario) => {
    const res = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(usuario)
    });
    const data = await res.json();

    return data.data;
};

export const updateUsuario = async (id_usuario, usuario) => {
    const res = await fetch(`${API_BASE_URL}/usuarios/${id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(usuario)
    });
    const data = await res.json();

    return data.data;
};

export const deleteUsuario = async (id_usuario) => {
    const res = await fetch(`${API_BASE_URL}/usuarios/${id_usuario}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    const data = await res.json();

    return data.data;
};