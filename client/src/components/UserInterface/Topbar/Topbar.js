import React from 'react';
import './Topbar.css'



const Topbar = ({handleComponentChange}) => {

  const handleClick = (component) => {
    handleComponentChange(component);
  };


  return (
    <div className="top-bar">   
      <button className="home-button" onClick={()=>handleClick('Home')}>
        Accueil
      </button>  
      <ul>
        <li className='top-bar-user-li'>
          <a href="/profile">
            Profile
          </a>
        </li>
        </ul>
    </div>
  );
};

export default Topbar;
