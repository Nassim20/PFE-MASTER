import React from 'react';
import './SidebarAdmin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SidebarAdmin = ({ handleComponentChange }) => {

  const handleClick = (component) => {
    handleComponentChange(component);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    // Send a POST request to the Flask server to handle logout
    axios.post('/logout')
      .then(response => {
        // Handle successful logout
        console.log(response.data.message);
        // Redirect to login page
        navigate('/');
      })
      .catch(error => {
        // Handle error
        console.error(error);
      });
  };

  return (
    <div className='sidebar-admin'>
      <ul>
        <li onClick={() => handleClick('Createcontainer')}>
          <a>
          Créer un nouveau container
          </a>
        </li>
        <li onClick={() => handleClick('Userlist')}>
          <a>
            Liste d'utilisateurs
          </a>
        </li>
        <li onClick={() => handleClick('Containerslist')}>
          <a>
            Gestion des containers
          </a>
        </li>
      </ul>
      <button className="logout-button-admin" onClick={handleLogout}>Deconnexion</button>
    </div>
  );
};

export default SidebarAdmin;
