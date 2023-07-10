import React from 'react';
import axios from 'axios';
import { useState } from 'react';


const NewRequestItem = (props) => {

    const [duree, setDuree] = useState('');
    const [containerId, setContainerId] = useState('');

    const handleButtonClick = async () => {
        try {
          setContainerId(props.container_ID);
          setDuree(props.duree);
          const response = await axios.post('/api/update-duree', {containerId, duree });
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      };

    return (
    <div>
        <span className="username"> Utilisateur: {props.username}</span>
        <span className="container-id"> ID container: {props.container_ID}</span>
        <span className="hosting-length">Durée(jours): {props.duree}</span>
        <button className="afficher-button" onClick={handleButtonClick}>Renouvler</button>
    </div>);
};

export default NewRequestItem