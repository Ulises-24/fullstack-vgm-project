const API_BASE_URL = 'http://localhost:3000/api';

export const getOrdenes = async () => {
    const response = await fetch(`${API_BASE_URL}/ordenes`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Error al obtener órdenes');
    }

    const data = await response.json();
    return data.data;
};

export const createOrden = async (orden) => {
    const res = await fetch(`${API_BASE_URL}/ordenes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(orden)
    });

    if (!res.ok) {
        throw new Error('Error al crear la orden');
    }

    const data = await res.json();
    return data.data;
};

export const updateOrden = async (id_orden, orden) => {
    const res = await fetch(`${API_BASE_URL}/ordenes/${id_orden}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(orden)
    });

    if (!res.ok) {
        throw new Error('Error al actualizar la orden');
    }

    const data = await res.json();
    return data.data;
};

export const deleteOrden = async (id_orden) => {
    const res = await fetch(`${API_BASE_URL}/ordenes/${id_orden}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!res.ok) {
        throw new Error('Error al eliminar la orden');
    }

    const data = await res.json();
    return data.data;
};

export const getDetalleOrden = async (id_orden) => {
    const response = await fetch(
        `${API_BASE_URL}/ordenes/detalles/orden/${id_orden}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        }
    );

    if (!response.ok) {
        const text = await response.text();
        console.error('Respuesta backend:', text);
        throw new Error('Error al obtener detalle de orden');
    }

    const data = await response.json();

    return data.data ?? data;
};

