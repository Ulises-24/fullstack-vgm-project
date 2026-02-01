import React, { useState } from "react";
import { getGoogleAuthUrl, getMicrosoftAuthUrl } from "../api/auth";
import { FcGoogle } from 'react-icons/fc'
import { BsMicrosoft } from 'react-icons/bs'
import '../Styles/Login.css'

function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAuth = async (provider) => {
        try {
            setLoading(true);
            setError(null);

            let url;

            if (provider === "google") {
                url = await getGoogleAuthUrl();
            } else if (provider === "microsoft") {
                url = await getMicrosoftAuthUrl();
            }

            sessionStorage.setItem("authProvider", provider);
            window.location.href = url;
        } catch (error) {
            console.error(`Error en autenticación con ${provider}:`, error);
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Iniciar sesión</h1>

                {error && (
                    <p className="error-text">
                        Error: {error}
                    </p>
                )}

                <button
                    className="login-btn google"
                    onClick={() => handleAuth("google")}
                    disabled={loading}
                >
                    <FcGoogle size={20} />
                    {loading ? "Cargando..." : "Continuar con Google"}
                </button>

                <button
                    className="login-btn microsoft"
                    onClick={() => handleAuth("microsoft")}
                    disabled={loading}
                >
                    < BsMicrosoft size={20} />
                    {loading ? "Cargando..." : "Continuar con Microsoft"}
                </button>
            </div>
        </div>
    );
}

export default Login;
