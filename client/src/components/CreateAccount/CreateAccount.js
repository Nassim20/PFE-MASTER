import React, { useState } from 'react';
import axios from 'axios';
import './CreateAccount.css';
import { useNavigate } from 'react-router-dom';

const CreateAccountForm = ({ setCreateAccount }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    if (password === confirmPassword) {
    try {
      const response = await axios.post('/api/create-account', {
        username,
        password,
        email,
      });
      console.log(response.data);
      navigate("/");

      // Handle successful account creation
    } catch (error) {
      console.error(error.response.data);
      // Handle account creation error
    }}
    else {
      console.log('Passwords do not match');
    }



  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
    // Perform account creation logic here
    // Send the form values to the Flask server for further processing

    // Reset form fields
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    
  };

  return (
    <div className="container-create-account ">
      <h1>Nouveau compte</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="username">Nom d'utilisateur :</label>
          <input
            className="input_add_accoount"
            type="text"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="password">Mot de passe :</label>
          <input
            className="input_add_accoount"
            type="password"
            required
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="confirm-password">Confirmer mot de passe :</label>
          <input
          className="input_add_accoount"
            type="password"
            id="confirm-password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {passwordError && <p className="error">{passwordError}</p>}
        <div className="form-group">
          <label className="label" htmlFor="email">Email :</label>
          <input
            className="input_add_accoount"
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="button" onClick={handleCreateAccount}>Créer Compte</button>
        </div>
        <p className="login-option">
          <a href="/">Se connecter</a>
        </p>0
      </form>
    </div>
  );
};

export default CreateAccountForm;
