import React from "react";
import "./MainContent.css";

const MainContent = (props) => {

  return (
    <div className="main-content-div">
      <h1 className="main-title"> Bienvenue dans le menu principal</h1>
      <div className="options-div">
        <li>
          <a onClick={()=> props.handleComponentChange('subscription')}>
            Nouveau hébergement
          </a>
        </li>
        <li>
          <a onClick={()=> props.handleComponentChange('containers')}>
            Liste des sites possédés
          </a>
        </li>
        <li>
          <a onClick={()=> props.handleComponentChange('container_details')}>
          Gérer les sites
          </a>
        </li>
      </div>
    </div>
  );
};

export default MainContent;