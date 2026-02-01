import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDetalleOrden, getOrdenes, updateOrden, createOrden, deleteOrden } from '../api/ordenes';
import { FaBoxes } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import '../Styles/Ordenes.css';

function Ordenes() {
    const [ordenes, setOrdenes] = useState([]);
    const [expandedOrden, setExpandedOrden] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detalles, setDetalles] = useState({});
    const [loadingDetalle, setLoadingDetalle] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingOrden, setEditingOrden] = useState(null);
    const [formData, setFormData] = useState({
        id_usuario: '',
        juegos: [{ nombre_juego: '', cantidad: 1, precio_unitario: '' }]
    });

    useEffect(() => {
        fetchOrdenes();
    }, []);

    const fetchOrdenes = async () => {
        try {
            setLoading(true);
            const response = await getOrdenes();
            const data = response?.data || response;
            setOrdenes(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error al cargar ordenes:', err);
        } finally {
            setLoading(false);
        }
    };

    // CORRECCIÓN: handleOpenModal ahora es async para cargar detalles al editar
    const handleOpenModal = async (orden = null) => {
        if (orden) {
            setEditingOrden(orden);
            try {
                // Buscamos los detalles reales de la API para llenar el formulario
                const dataDetalle = await getDetalleOrden(orden.id_orden);
                const detallesArray = Array.isArray(dataDetalle) ? dataDetalle : [dataDetalle];

                setFormData({
                    id_usuario: orden.id_usuario,
                    juegos: detallesArray.map(d => ({
                        nombre_juego: d.nombre_juego,
                        cantidad: d.cantidad,
                        precio_unitario: d.precio_unitario
                    }))
                });
            } catch (err) {
                console.error("Error cargando detalles para editar:", err);
                alert("No se pudieron cargar los detalles de la orden.");
            }
        } else {
            setEditingOrden(null);
            setFormData({
                id_usuario: '',
                juegos: [{ nombre_juego: '', cantidad: 1, precio_unitario: '' }]
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingOrden(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const detalleOrdenData = formData.juegos.map(juego => {
                const c = parseInt(juego.cantidad) || 0;
                const p = parseFloat(juego.precio_unitario) || 0;
                return {
                    nombre_juego: juego.nombre_juego,
                    cantidad: c,
                    precio_unitario: p,
                    subtotal: Number((c * p).toFixed(2))
                };
            });

            const sumaTotal = detalleOrdenData.reduce((acc, item) => acc + item.subtotal, 0);

            const payload = {
                id_usuario: parseInt(formData.id_usuario),
                total: parseFloat(sumaTotal.toFixed(2)),
                DetalleOrdens: detalleOrdenData
            };

            if (editingOrden) {
                await updateOrden(editingOrden.id_orden, payload);

                setDetalles(prev => {
                    const newDetalles = { ...prev };
                    delete newDetalles[editingOrden.id_orden];
                    return newDetalles;
                });
                setExpandedOrden(null);

                alert('Orden actualizada con éxito');
            } else {
                await createOrden(payload);
                alert('Orden creada con éxito');
            }

            handleCloseModal();
            fetchOrdenes();
        } catch (err) {
            alert(`Error: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`¿Estás seguro de eliminar la orden #${id}?`)) return;
        try {
            await deleteOrden(id);
            fetchOrdenes();
            alert('Orden eliminada con éxito');
        } catch (err) {
            alert(`No se pudo eliminar: ${err.response?.data?.message || err.message}`);
        }
    };

    const toggleDetalle = async (id_orden) => {
        if (expandedOrden === id_orden) {
            setExpandedOrden(null);
            return;
        }
        setExpandedOrden(id_orden);
        if (!detalles[id_orden]) {
            setLoadingDetalle(id_orden);
            try {
                const data = await getDetalleOrden(id_orden);
                setDetalles(prev => ({ ...prev, [id_orden]: Array.isArray(data) ? data : [data] }));
            } catch (error) {
                console.error('Error al obtener detalle', error);
            } finally {
                setLoadingDetalle(null);
            }
        }
    };

    if (loading) return <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><p>Cargando órdenes...</p></div>;

    return (
        <div className="page-container">
            <header className="home-header">
                <div>
                    <h1><FaBoxes size={20} /> Ordenes</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Gestión de pedidos y productos</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-header" style={{ background: '#10b981', color: 'white' }} onClick={() => handleOpenModal()}>Crear</button>
                    <button className="btn-header" style={{ background: 'red', color: 'white' }} onClick={() => navigate('/home')}>Volver</button>
                </div>
            </header>

            <div className="glass-table-container">
                <table className="glass-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th style={{ textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordenes.map((orden) => (
                            <Fragment key={orden.id_orden}>
                                <tr className="orden-row">
                                    <td>{orden.id_orden}</td>
                                    <td>{orden.Usuario?.nombre_completo || 'Desconocido'}</td>
                                    <td>{new Date(orden.fecha_orden).toLocaleString()}</td>
                                    <td>${parseFloat(orden.total).toFixed(2)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button onClick={() => toggleDetalle(orden.id_orden)} className="btn-detail">
                                            {expandedOrden === orden.id_orden ? '▼' : '▶'} Detalles
                                        </button>
                                        <button onClick={() => handleOpenModal(orden)} className="btn-edit">Editar</button>
                                        <button onClick={() => handleDelete(orden.id_orden)} className="btn-delete">Eliminar</button>
                                    </td>
                                </tr>
                                {expandedOrden === orden.id_orden && (
                                    <tr>
                                        <td colSpan="5" className="detalle-container">
                                            {loadingDetalle === orden.id_orden ? "Cargando..." : (
                                                <div className="detalle-content">
                                                    <table className="detalle-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Producto</th>
                                                                <th>Cant.</th>
                                                                <th>Precio</th>
                                                                <th>Subtotal</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {(detalles[orden.id_orden] || []).map((d, index) => (
                                                                <tr key={index}>
                                                                    <td>{d.nombre_juego}</td>
                                                                    <td>{d.cantidad}</td>
                                                                    <td>${parseFloat(d.precio_unitario).toFixed(2)}</td>
                                                                    <td>${parseFloat(d.subtotal).toFixed(2)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Final:</td>
                                                                <td style={{ fontWeight: 'bold' }}>
                                                                    ${parseFloat(orden.total).toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className='modal-header'>
                            <h2>{editingOrden ? `Editando Orden #${editingOrden.id_orden}` : 'Nueva Orden'}</h2>
                            <button onClick={handleCloseModal} className="btn-close"><IoClose size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className='modal-form'>
                            <div className='form-group'>
                                <label>ID Usuario</label>
                                <input
                                    type="number"
                                    value={formData.id_usuario}
                                    onChange={(e) => setFormData({ ...formData, id_usuario: e.target.value })}
                                    required
                                />
                            </div>
                            <hr />
                            <h3>Productos</h3>
                            {formData.juegos.map((juego, index) => (
                                <div key={index} className="juego-form-section" style={{ marginBottom: '10px', padding: '10px', border: '1px solid #334155', borderRadius: '8px' }}>
                                    <div className='form-group'>
                                        <label>Nombre del Juego</label>
                                        <input
                                            type="text"
                                            value={juego.nombre_juego}
                                            onChange={(e) => {
                                                const nuevos = [...formData.juegos];
                                                nuevos[index].nombre_juego = e.target.value;
                                                setFormData({ ...formData, juegos: nuevos });
                                            }}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <div className='form-group'>
                                            <label>Cant.</label>
                                            <input
                                                type="number"
                                                value={juego.cantidad}
                                                onChange={(e) => {
                                                    const nuevos = [...formData.juegos];
                                                    nuevos[index].cantidad = e.target.value;
                                                    setFormData({ ...formData, juegos: nuevos });
                                                }}
                                                required
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label>Precio Unitario</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={juego.precio_unitario}
                                                onChange={(e) => {
                                                    const nuevos = [...formData.juegos];
                                                    nuevos[index].precio_unitario = e.target.value;
                                                    setFormData({ ...formData, juegos: nuevos });
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {formData.juegos.length > 1 && (
                                        <button type="button" onClick={() => setFormData({ ...formData, juegos: formData.juegos.filter((_, i) => i !== index) })} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', marginTop: '5px' }}>Eliminar Producto</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="btn-add" onClick={() => setFormData({ ...formData, juegos: [...formData.juegos, { nombre_juego: '', cantidad: 1, precio_unitario: '' }] })}>
                                + Agregar Juego
                            </button>
                            <div className="modal-footer">
                                <button type="button" onClick={handleCloseModal} className="btn-cancel">Cancelar</button>
                                <button type="submit" className="btn-save">{editingOrden ? 'Guardar Cambios' : 'Crear Orden'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Ordenes;