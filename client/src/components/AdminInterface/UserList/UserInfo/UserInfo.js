import React from "react";
import { useState } from "react";
import "./UserInfo.css";

const UserInfo = ({ username, password, email, numSites }) => {
    const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
        return(
          <div className="user-info-div">
        <div className="user-info">
        <h2>Utilisateur {username}</h2>
            <div className="info-div-item">
                <div className="info-item">
                    <span className="label">Nom d'utilisateur:</span>
                    <span className="value">{username}</span>
                </div>
                <div className="info-item">
                    <span className="label">Mot de passe:</span>
                    <span className="value">
          {showPassword ? (
            <input type="text" value={password} readOnly />) : (<input type="password" value="********" readOnly />)}
          <button onClick={togglePasswordVisibility} className="show-button">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </span>
                </div>
                <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{email}</span>
                </div>
                <div className="info-item">
                    <span className="label">Nombres des Sites:</span>
                    <span className="value">{numSites}</span>
                </div>
            </div>
    </div>
    </div>
        );
    }

export default UserInfo;