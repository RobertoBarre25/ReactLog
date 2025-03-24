import React, { useState } from 'react';
import './Login.css'; // Asegúrate de crear este archivo con los estilos
import { useNavigate } from 'react-router-dom';
import validator from 'validator'; // Importar validator.js para validar y sanitizar

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [nomUsuario, setNomUsuario] = useState('');
  const [conUsuario, setConUsuario] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePanel = () => {
    setIsSignUp(!isSignUp);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validar y sanitizar las entradas
    if (!validator.isAlphanumeric(nomUsuario)) {
      setError('El nombre de usuario solo puede contener caracteres alfanuméricos.');
      return;
    }

    if (!validator.isLength(conUsuario, { min: 4 })) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const loginData = {
      nom_usuario: nomUsuario,
      con_usuario: conUsuario,
    };

    try {
      // Enviar la solicitud POST a la API de login
      const response = await fetch('https://apimantenimiento.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      // Si la respuesta es exitosa, guardamos el token
      if (response.ok) {
        localStorage.setItem('authToken', data.token); // Guardamos el token en el localStorage
        navigate('/home'); // Redirigir a la página de inicio
      } else {
        setError(data.message + ' Error en los campos, vuelve a intentar ingresando un usuario y contraseña correctos');
      }
    } catch (error) {
      setError('Error connecting to the server');
    }
  };

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`}>
      <div className="form-container sign-up-container">
        <form action="#">
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={handleLogin}>
          <h1>Inicia Sesion</h1>
          <div className="social-container">
            <a className="social">
              <img src="https://cdn-icons-png.flaticon.com/128/3487/3487044.png" alt="Descripción de la imagen" style={{ width: '30px', height: 'auto' }} />
            </a>
          </div>
          <input
            type="text"
            placeholder="Nombre de Usuario"
            value={nomUsuario}
            onChange={(e) => setNomUsuario(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={conUsuario}
            onChange={(e) => setConUsuario(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button>Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-right">
            <h1>Hola Bienvenido!</h1>
            <p>Bienvenid@ a Alda's Company una exitosa empresa de Logistica</p>
            <a className="social">
              <img src="https://cdn-icons-png.flaticon.com/128/5968/5968374.png" alt="Descripción de la imagen" style={{ width: '60px', height: 'auto' }} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;