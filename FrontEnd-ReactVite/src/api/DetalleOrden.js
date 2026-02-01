const API_BASE_URL = 'http://localhost:3000/api';

export const getDetalleOrden = async (id_orden) => {
    const limpioId = String(id_orden).replace('orden', '');

    const response = await fetch(`${API_BASE_URL}/ordenes/detalles/orden/${limpioId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Error al obtener detalle de orden');
    }

    return await response.json();
};