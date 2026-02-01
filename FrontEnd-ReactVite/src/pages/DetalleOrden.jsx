import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDetalleOrden } from '../api/ordenes';
import '../Styles/Dashboar.css';

function DetalleOrden() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orden, setOrden] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const data = await getDetalleOrden(id_orden);
                setOrden(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetalle();
    }, [id]);

    if (loading) return <div className="page-container">Cargando detalles...</div>;
    if (!orden) return <div className="page-container">Orden no encontrada.</div>;

    return (
        <div className="page-container">
            <header className="home-header">
                <div>
                    <h1>📦 Detalle de Orden: #{id}</h1>
                    <p style={{ color: '#94a3b8' }}>Información completa del despacho</p>
                </div>
                <button className="home-header button" onClick={() => navigate('/ordenes')}>
                    Volver a Lista
                </button>
            </header>

            <div className="cards" style={{ marginTop: '24px' }}>
                <div className="card" style={{ textAlign: 'left', cursor: 'default' }}>
                    <h4 style={{ color: '#38bdf8', marginBottom: '8px' }}>Cliente</h4>
                    <p>{orden.Usuario?.nombre_completo}</p>
                    <small style={{ color: '#94a3b8' }}>{orden.Usuario?.correo}</small>
                </div>
                <div className="card" style={{ textAlign: 'left', cursor: 'default' }}>
                    <h4 style={{ color: '#38bdf8', marginBottom: '8px' }}>Fecha y Total</h4>
                    <p>{new Date(orden.fecha_orden).toLocaleDateString()}</p>
                    <p style={{ color: '#10b981', fontWeight: 'bold' }}>${parseFloat(orden.total).toFixed(2)}</p>
                </div>
            </div>

            <h3 style={{ marginTop: '40px', marginBottom: '16px', color: '#94a3b8' }}>Artículos Incluidos</h3>
            <div className="glass-table-container">
                <table className="glass-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(orden.Detalles || orden.detalles_orden || []).map((item, index) => (
                            <tr key={index}>
                                <td style={{ fontWeight: '500' }}>
                                    {item.Producto?.nombre || item.nombre_producto || 'Carga General'}
                                </td>
                                <td>{item.cantidad} unidades</td>
                                <td>${parseFloat(item.precio_unitario || 0).toFixed(2)}</td>
                                <td className="text-total">
                                    ${(item.cantidad * (item.precio_unitario || 0)).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DetalleOrden;