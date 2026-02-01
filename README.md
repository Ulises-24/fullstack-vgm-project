# 🎮 Sistema de Gestión de Órdenes y Usuarios (Proyecto Académico)

Este proyecto es una aplicación **Full-Stack** diseñada para la gestión administrativa de una tienda de videojuegos. Permite el control centralizado de usuarios y el procesamiento de órdenes de compra con detalles dinámicos, utilizando una arquitectura de API REST local.

## 🚀 Características Principales

- **Gestión de Usuarios**: CRUD completo con soporte para atributos específicos como `nombre_completo`, `correo` y `proveedor_login`.
- **Sistema de Órdenes y Detalles**: 
    - Creación y actualización de órdenes en tiempo real.
    - Manejo dinámico de múltiples productos por orden (detalles).
- **Integridad de Datos (Transacciones)**: Implementación de **Sequelize Transactions** para garantizar que la actualización de cabeceras y detalles sea atómica (Rollback automático en caso de error).
- **Interfaz Glassmorphism**: Diseño de tablas translúcidas con estados visuales (badges) y componentes reactivos.

---

## 🛠️ Stack Tecnológico

### Frontend
- **JavaScript (ES6+)**: Lenguaje base para la lógica del cliente.
- **React.js**: Biblioteca principal para la construcción de interfaces de usuario.
- **Vite**: Herramienta de construcción (build tool) para un desarrollo rápido y optimizado.
- **CSS3**: Estilos personalizados con efectos de transparencia y desenfoque (Glassmorphism).
- **Axios**: Cliente HTTP para el consumo de la API REST.

### Backend
- **Node.js**: Entorno de ejecución para el servidor.
- **Express.js**: Framework para la creación de la API y manejo de rutas.
- **Sequelize (ORM)**: Gestión de la base de datos relacional y modelos.
- **Winston / Morgan**: Logger para monitoreo de peticiones y depuración de errores.

### Base de Datos
- **MySQL**: Motor de base de datos relacional para persistencia de datos.

---

## 📦 Estructura de Datos (Modelos)

El proyecto se basa en una relación relacional sólida:

1.  **Usuarios**: `id_usuario`, `nombre_completo`, `correo`, `proveedor_login`, `estado`.
2.  **Ordenes**: `id_orden`, `id_usuario`, `total`, `fecha`.
3.  **Detalle_Orden**: `id_detalle`, `id_orden`, `nombre_juego`, `cantidad`, `precio_unitario`, `subtotal`.

---

## 🔧 Configuración del Proyecto

### 1. Requisitos Previos
- Node.js (v16 o superior).
- Servidor MySQL activo.

### 2. Instalación (Backend)
```bash
cd backend
npm install
# Configurar archivo .env con credenciales de DB
npm run dev
