import React from 'react';

/**
 * @param {string} variant - 'edit' (azul), 'delete' (rojo), 'success' (verde), 'ghost' (transparente)
 * @param {string} type - 'button' o 'submit'
 */
const ActionButton = ({
    children,
    onClick,
    variant = 'edit',
    type = 'button',
    className = '',
    style = {}
}) => {
    // Mapeamos la variante a la clase CSS correspondiente
    const variantClass = `btn-${variant}`;

    return (
        <button
            type={type}
            className={`btn-action ${variantClass} ${className}`}
            onClick={onClick}
            style={style}
        >
            {children}
        </button>
    );
};

export default ActionButton;