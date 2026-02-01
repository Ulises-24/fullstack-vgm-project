import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../api/usuarios';
import { useUser } from '../context/UserContext';
import { FaUsers } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import '../Styles/Usuarios.css';

const Usuarios = () => {
    const navigate = useNavigate();
    const { user: loggedInUser, setUser } = useUser();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const initialForm = {
        nombre_completo: '',
        correo: '',
        proveedor_login: 'MICROSOFT',
        id_microsoft: '',
        estado: true
    };

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const response = await getUsuarios();
            const data = response?.data?.data || response?.data || response;
            setUsuarios(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError("No se pudieron cargar los usuarios.");
        } finally {
            setLoading(false);
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "N/A";
        const d = new Date(fecha);
        return isNaN(d.getTime()) ? "Fecha inválida" : d.toLocaleDateString();
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleOpenModal = (usuario = null) => {
        if (usuario) {
            setEditingUser(usuario);
            setFormData({
                nombre_completo: usuario.nombre_completo || '',
                correo: usuario.correo || '',
                proveedor_login: usuario.proveedor_login || 'MICROSOFT',
                id_microsoft: usuario.id_microsoft || '',
                estado: usuario.estado !== undefined ? usuario.estado : true
            });
        } else {
            setEditingUser(null);
            setFormData(initialForm);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData(initialForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Enviando datos:", formData);

        try {
            if (editingUser) {
                await updateUsuario(editingUser.id_usuario, formData);

                if (loggedInUser && loggedInUser.id_usuario === editingUser.id_usuario) {
                    setUser({ ...loggedInUser, ...formData });
                }
                console.log("Usuario actualizado correctamente");
            } else {
                const res = await createUsuario(formData);
                console.log("Usuario creado:", res);
            }

            handleCloseModal();
            fetchUsuarios();
        } catch (err) {
            console.error("Error en el proceso:", err);
            const msg = err.response?.data?.message || err.message;
            alert(`Error: ${msg}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
        try {
            await deleteUsuario(id);
            fetchUsuarios();
        } catch (err) {
            alert(`Error al eliminar: ${err.message}`);
        }
    };

    return (
        <div className="usuarios-container">
            <header className='home-header'>
                <div>
                    <h1><FaUsers size={20} /> Usuarios</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Monitoreo de usuarios</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className="btn-header"
                        style={{ background: '#10b981', color: 'white', border: 'none', cursor: 'pointer' }}
                        onClick={() => handleOpenModal()}
                    >
                        Crear
                    </button>
                    <button
                        className="btn-header"
                        style={{ background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
                        onClick={() => navigate('/home')}
                    >
                        Volver
                    </button>
                </div>
            </header>

            {error && <div className="usuarios-error">{error}</div>}

            <div className="usuarios-table-container">
                <table className="usuarios-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Completo</th>
                            <th>Correo</th>
                            <th>Proveedor</th>
                            <th>Estado</th>
                            <th>Fecha Registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="no-data">Cargando...</td></tr>
                        ) : usuarios.length === 0 ? (
                            <tr><td colSpan="7" className="no-data">No hay usuarios registrados</td></tr>
                        ) : (
                            usuarios.map((usuario) => (
                                <tr key={usuario.id_usuario}>
                                    <td>{usuario.id_usuario}</td>
                                    <td>{usuario.nombre_completo}</td>
                                    <td>{usuario.correo}</td>
                                    <td>{usuario.proveedor_login}</td>
                                    <td>
                                        <span className={`estado-badge ${usuario.estado ? 'activo' : 'inactivo'}`}>
                                            {usuario.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>{formatearFecha(usuario.fecha_registro)}</td>
                                    <td className="usuarios-actions">
                                        <button onClick={() => handleOpenModal(usuario)} className="btn-edit">Editar</button>
                                        <button onClick={() => handleDelete(usuario.id_usuario)} className="btn-delete">Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                            <button onClick={handleCloseModal} className="btn-close"><IoClose size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Nombre Completo *</label>
                                <input
                                    name="nombre_completo"
                                    value={formData.nombre_completo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Correo *</label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Proveedor *</label>
                                <select name="proveedor_login" value={formData.proveedor_login} onChange={handleInputChange}>
                                    <option value="Microsoft">Microsoft</option>
                                    <option value="Google">Google</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>ID Proveedor *</label>
                                <input
                                    name="id_microsoft"
                                    value={formData.id_microsoft}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="estado"
                                        checked={formData.estado}
                                        onChange={handleInputChange}
                                    />
                                    Usuario Activo
                                </label>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={handleCloseModal} className="btn-cancel">Cancelar</button>
                                <button type="submit" className="btn-save">
                                    {editingUser ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Usuarios;