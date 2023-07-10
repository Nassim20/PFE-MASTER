import React from "react";
import './SuppContainer.css'
import { useState } from "react";

const SuppContainer = () => {

    const [containerId, setContainerId] = useState('');
     const [password, setPassword] = useState('');

    const handleFormSubmit = (e) => {
    e.preventDefault();

    // Perform container deletion logic here
    // Access the containerId and password values from the state variables

    // Clear the form fields after submission
    setContainerId('');
    setPassword('');
  };

    return (
        <div className="supp-main-div">
            <h1> Supprimer container </h1>
            <div className="supp-sub-div">
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                <label htmlFor="containerId">Container ID:</label>
                <input
                    type="text"
                    id="containerId"
                    value={containerId}
                    onChange={(e) => setContainerId(e.target.value)}
                />
                </div>
                <div className="form-group">
                <label htmlFor="password">Mot de passe:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                <button type="submit">Supprimer</button>
      </form>

            </div>
        </div>
    );
}

export default SuppContainer