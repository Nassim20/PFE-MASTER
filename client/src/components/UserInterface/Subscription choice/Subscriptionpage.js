import React from 'react'
import './Subscriptionpage.css'
import { useState } from 'react'
import axios from 'axios'

const Subscriptionpage = () => {

    const [choice, setChoice] = useState('');
    const [isPToggled, setIsPToggled] = useState(false);
    const [isGToggled, setIsGToggled] = useState(false);
    const [isNToggled, setIsNToggled] = useState(false);

    const handlePToggle = () => {
        setIsPToggled(!isPToggled);
        setIsGToggled(false);
        setIsNToggled(false);
        setChoice('Platinium');
    };
    const handleGToggle = () => {
        setIsPToggled(false);
        setIsGToggled(!isGToggled);
        setIsNToggled(false);
        setChoice('Gold');
    };
    const handleNToggle = () => {
        setIsPToggled(false);
        setIsGToggled(false);
        setIsNToggled(!isNToggled);
        setChoice('Normal');
    };

    const handleCreateRequest = () => {
        // Send a POST request to the Flask server to handle create request
        axios.post('/create_request', {
          type: choice,
          duree: duree
        })
          .then(response => {
            // Handle successful request creation
            console.log(response.data.message);
          })
          .catch(error => {
            // Handle error
            console.error(error);
          });
      };

      const handleAnnuler = () => {
        setDuree('');
      }

    //const [activeComponent, setActiveComponent] = useState(false);
    
    const [duree, setDuree] = useState('');
    //const handleButtonClick = (choice) => {
    //    setActiveComponent('');
    //    setChoice('');
    //    setHostingLength('');
    //}
    
  return (
    <div className='subs-main-div'>
        <h1 className='subs-title'>Veuillez choisir un abonnement </h1>
        <div className='choices-div'>
            <div className='sub-div'>
                <div className='button-div'>
                    <button className="Platinum-button" onClick={handlePToggle}
                    style={{ backgroundColor: isPToggled ? '#2c1794' : '#7e64ff' }}>Platinum subscription</button>
                </div>
                <div className='list-div'>
                    <li>
                        RAM : 512 MB
                    </li>
                    <li>
                        Storage : 1 GB
                    </li>
                    <li>
                        CPU : 1 Core
                    </li>
                </div>
            </div>
            <div className='sub-div'>  
                <div className='button-div'>
                    <button className="Gold-button" onClick={handleGToggle}
                    style={{ backgroundColor: isGToggled ? '#d4b90a' : '#ebca0b' }}>Gold subscription</button>
                </div>
                <div className='list-div'>
                    <li>
                        RAM : 256 MB
                    </li>
                    <li>
                        Storage : 1 GB
                    </li>
                    <li>
                        CPU : 1 Core
                    </li>
                </div>
            </div>
            <div className='sub-div'>
                <div className='button-div'>
                    <button className="Normal-button" onClick={handleNToggle}
                    style={{ backgroundColor: isNToggled ? '#6b6b6b' : '#808080' }}>Normal subscription</button>
                </div>
                <div className='list-div'>
                    <li>
                        RAM : 128 MB
                    </li>
                    <li>
                        Storage : 1 GB
                    </li>
                    <li>
                        CPU : 1 Core
                    </li>
                </div>
            </div>
        </div>

        <div className='button-duree'>
        <div className="duree-div">
            <label>Durée (Jours):</label>
            <input
                type="number"
                min="30"
                id="hostingLength"
                value={duree}
                onChange={(e) => setDuree(e.target.value)}
                required
                />
            </div>
        <div className='confirmation-div'>
            <h3 className='confirmation-title'>Confirmer votre choix </h3>
            <div>      
                <button className="button-confirmation" onClick={handleCreateRequest}>Confirmer</button>
                <button className="button-annuler">Annuler</button>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Subscriptionpage