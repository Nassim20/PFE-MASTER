import React from "react";
import './Homepage.css'

const Homepage = (props) => {
    return (
        <div>
            <h1 className="main-title-admin"> Bienvenue dans le menu principal</h1>
            <div className="options-div">
                <li>
                    <a onClick={()=> props.handleComponentChange('Createcontainer')}>
                        Creer un nouveau container
                    </a>
                </li>
                <li>
                    <a onClick={()=> props.handleComponentChange('Userlist')}>
                        Liste des utilisateurs
                    </a>
                </li>
                <li>
                    <a onClick={()=> props.handleComponentChange('Containerslist')}>
                    Gérer les containers
                    </a>
                </li>
            </div>
        </div>
    );
    }

    export default Homepage;