import React, { useState } from 'react';
import './Login.css'; // Asegúrate de crear este archivo con los estilos
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [nomUsuario, setNomUsuario] = useState('');  // Aquí cambiaremos el nombre del estado
  const [conUsuario, setConUsuario] = useState('');  // Aquí cambiamos también para la contraseña
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const togglePanel = () => {
    setIsSignUp(!isSignUp);
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = {
      nom_usuario: nomUsuario,  // Aquí usamos "nom_usuario" para el nombre de usuario
      con_usuario: conUsuario,  // Aquí usamos "con_usuario" para la contraseña
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
        // Redirigir a otra vista o hacer algo más después del login
        // Por ejemplo, podrías redirigir con React Router:
        navigate('/home');
      } else {
        setError(data.message+' Error en los campos, vuelve a intentar ingresando un usuario y contraseña correctos'); // Mostrar un mensaje de error si el login falla
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
          <h1>Sign in</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your account</span>
          <input
            type="text"  // Cambiamos de "email" a "text" porque ahora el campo es nombre de usuario
            placeholder="Nombre de Usuario"
            value={nomUsuario}
            onChange={(e) => setNomUsuario(e.target.value)}  // Aquí actualizamos el estado con el nombre de usuario
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={conUsuario}
            onChange={(e) => setConUsuario(e.target.value)}  // Actualizamos el estado con la contraseña
          />
          <a href="#">Forgot your password?</a>
          {error && <p className="error">{error}</p>}
          <button>Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={togglePanel}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" onClick={togglePanel}>Sign Up</button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
