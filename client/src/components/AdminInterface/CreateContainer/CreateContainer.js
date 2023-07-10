import React from "react";
import { useState } from "react";
import axios from "axios";
import "./CreateContainer.css";
import RequestsList from "./RequestsList/RequestsList";
import NewRequestsList from "./NewRequestsList/NewRequestsList";

const CreateContainer = () => {
    const [containerName, setContainerName] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [containerType, setContainerType] = useState('');  
    const [duree, setDuree] = useState('');
    const [showRequestsList, setShowRequestsList] = useState('main');

    const handleCreateContainer = async () => {
      try {
        const response = await axios.post('/api/create-container', {
          containerName,
          password,
          containerType,
          duree,
          username,
        });
        console.log(response.data);
        // Handle successful container creation
      } catch (error) {
        console.error(error.response.data);
        // Handle container creation error
      }
    };
    

    const handleGoBack = () => {
      console.log("HandleGoBack");
      setShowRequestsList('main');
    };

    const handleRequestclick = (user,type,duree) => {
      console.log("handleRequestclick");
      setUsername(user);
      setContainerType(type);
      setDuree(duree);
      setShowRequestsList('main');
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();
      // Perform container creation logic here
      // Access the form values from the state variables (containerName, password, username, containerType)
  
      // Clear the form fields after submission
      setContainerName('');
      setPassword('');
      setUsername('');
      setContainerType('');
      setDuree('');
    };
  
    return (
        <div>
        <h2 className="container-creation-title">Creation d'un container</h2>

        {showRequestsList === 'demande' ? (
        <RequestsList requestclick={handleRequestclick} goBack={handleGoBack} />
      ) : showRequestsList==='main' ? (
      <div className="container-creation">
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="containerName">Nom du container:</label>
            <input
              type="text"
              id="containerName"
              value={containerName}
              required
              onChange={(e) => setContainerName(e.target.value)}
              />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe:</label>
            <input
              minLength={6}
              type="password"
              id="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur:</label>
            <input
              type="text"
              id="username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              />
          </div>
          <div className="form-group">
            <label htmlFor="containerType">Type du container:</label>
            <select
              id="containerType"
              required
              value={containerType}
              onChange={(e) => setContainerType(e.target.value)}
              >
              <option value="">Select Type</option>
              <option value="Normal">Normal</option>
              <option value="Gold">Gold</option>
              <option value="Platinium">Platinium</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="duree">Durée (in Days):</label>
            <input
                type="number"
                id="duree"
                value={duree}
                onChange={(e) => setDuree(e.target.value)}
                required
            />
            </div>
          <button type="submit" onClick={handleCreateContainer}>Create</button>
        </form>

      </div>) : (
        <NewRequestsList goBack={handleGoBack} />
      )
      }
      <div className="container-creation-buttons-div">
      <button className="viewRequests-button" onClick={() => setShowRequestsList('demande')}>Voir demandes de creation</button>
      <button className="viewRequests-button" onClick={() => setShowRequestsList('new')}>Voir demandes de renouvelement</button>
      </div>
    </div>
        );
    }

    export default CreateContainer;