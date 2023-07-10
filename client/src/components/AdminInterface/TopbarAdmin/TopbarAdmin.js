import React from 'react';
import './TopbarAdmin.css'



const TopbarAdmin = ({handleComponentChange}) => {

  const handleClick = (component) => {
    handleComponentChange(component);
  };


  return (
    <div className="top-bar-admin">   
      <button className="home-button-admin" onClick={()=>handleClick('Home')}>
        Accueil
      </button>  
      <ul>
        <li >
          <a href="/profile">
            Profile
          </a>
        </li>
        </ul>
    </div>
  );
};

export default TopbarAdmin;
