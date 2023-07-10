import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic here (e.g., API call, authentication)

    // Reset form fields
    setUsername('');    
    setPassword('');
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { username, password });
      console.log(response.data);

        if(response.data.message ==='Login successful')
          if(username === 'admin')
            navigate('/AdminHome');
          else
            navigate('/UserHome');
      else
        console.log('Login failed');
      // Handle successful login, e.g., store user token in local storage
    } catch (error) {
      console.error(error.response.data);
      // Handle login error
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="username">Nom d'utilisateur: </label>
          <input
            type="text"
            id="username"
            className="input"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="password">Mot de passe: </label>
          <input
            type="password"
            id="password" 
            className="input"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="button" onClick={handleLogin}>Se connecter</button>
        </div>
        <p className="create-account">
          Nouveau utilisateur? <a href="createaccount" >Créer un nouveau compte</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;