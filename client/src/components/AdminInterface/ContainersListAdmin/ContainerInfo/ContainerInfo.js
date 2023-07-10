import React, {useState} from 'react';
import axios from 'axios';
import './ContainerInfo.css';

const ContainerInfo = ({ containerId, containerIp, hostLength, userOwner }) => {

  const [containerID, setContainerID] = useState({containerId});

  const handleTurnUp = () => {
    axios.post('/api/container/turnup', { containerId })
      .then(response => {
        console.log(response.data);
        // Handle success, if needed
      })
      .catch(error => {
        console.error(error);
        // Handle error, if needed
      });
  };

  const handleShutdown = () => {
    axios.post('/api/container/shutdown', { containerId })
      .then(response => {
        console.log(response.data);
        // Handle success, if needed
      })
      .catch(error => {
        console.error(error);
        // Handle error, if needed
      });
  };

  const handleReboot = () => {
    axios.post('/api/container/reboot', { containerId })
      .then(response => {
        console.log(response.data);
        // Handle success, if needed
      })
      .catch(error => {
        console.error(error);
        // Handle error, if needed
      });
  };

  const handleDelete = () => {
    axios.post('/api/container/delete', { containerId })
      .then(response => {
        console.log(response.data);
        // Handle success, if needed
      })
      .catch(error => {
        console.error(error);
        // Handle error, if needed
      });
  };

  return (
    <div className="container-info">
      <h2>Information du container</h2>
      <div className="info-item">
        <span className="label">Container ID:</span>
        <span className="value">{containerId}</span>
      </div>
      <div className="info-item">
        <span className="label">Container IP:</span>
        <span className="value">{containerIp}</span>
      </div>
      <div className="info-item">
        <span className="label">Durée (restants):</span>
        <span className="value">{hostLength}</span>
      </div>
      <div className="info-item">
        <span className="label">Utilisateur:</span>
        <span className="value">{userOwner}</span>
      </div>
      <div className="button-group">
        <button onClick={handleTurnUp}>On</button>
        <button onClick={handleShutdown}>Off</button>
        <button onClick={handleReboot}>Redémarrer</button>
      </div>
      <div className='supprimer-button-div'>
        <button className='supprimer-button' onClick={handleDelete}>Supprimer container</button>
      </div>
    </div>
  );
};

export default ContainerInfo;
