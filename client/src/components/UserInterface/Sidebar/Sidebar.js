import React from 'react';
import './Sidebar.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Sidebar = ({ handleComponentChange }) => {
  
  const handleClick = (component) => {
    handleComponentChange(component);
  };
  
  const navigate = useNavigate();
  const handleLogout = () => {
    // Send a POST request to the Flask server to handle logout
    axios.post('/logout')
    .then(response => {
      console.log(response.data);
      // Handle success, if needed
      navigate('/');
    })
    .catch(error => {
      console.error(error);
      // Handle error, if needed
    });
  };

  return (
    <div className='sidebar'>
      <ul>
        <li onClick={() => handleClick('subscription')}>
          <a >
            Demande d'hébergement
          </a>
        </li>
        <li onClick={() => handleClick('container_details')}>
          <a >
            Liste des sites
          </a>
        </li>
        <li onClick={() => handleClick('containers')}>
          <a>
            Gestion des sites
          </a>
        </li>
      </ul>
      <button className="logout-button" onClick={handleLogout}>Deconnexion</button>
    </div>
  );
};

export default Sidebar;
