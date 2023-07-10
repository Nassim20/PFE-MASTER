import React from "react";
import { useState } from "react";
import './ContainerSite.css'
import axios from 'axios';

function calculateEndDate(days) {
    const today = new Date();
    const endDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    // Extract the year, month, and day from the endDate
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, '0');
    const day = String(endDate.getDate()).padStart(2, '0');
    
    // Return the formatted end date
    return `${year}-${month}-${day}`;
  }

const ContainerSite = (props) => {

    //const currentDate = new Date();
    //const difference = endDate.getTime() - currentDate.getTime();
    //const daysLeft = Math.ceil(difference / (1000 * 3600 * 24));
    
    const [duree, setDuree] = useState(props.duree);
    const [containerName, setContainerName] = useState(props.siteName);
    const [renewDuree, setRenewDuree] = useState('');
    const endDate = calculateEndDate(duree);
    
    const containerClassEnd = duree<=10 ? 'containerEnding' : 'containerNotEnding';
    
    const[showInputDuree, setShowInputDuree] = useState(false);
    
    const handleRenouvelerClick = () => {
        console.log('Renouveler abonnement');
        setShowInputDuree(true);
    }

    
    const handleRenew = () => {
        console.log({ containerName, renewDuree});

        // Send a POST request to the Flask server to send the renew request
        axios.post('/renew', { containerName, renewDuree })
          .then(response => {
            // Handle the response
            console.log(response.data.message);
          })
          .catch(error => {
            // Handle error
            console.error(error);
          });
          setShowInputDuree(false)
      };


    return (
        <div className="containers-box-details">
        <div className='container-site-div'>
            <h1 className="container-site-title">{props.siteName}</h1>
            <div className="container-site-subDiv">   
                <div className="container-site-liste-div">            
                    <li className={`${containerClassEnd}`}>
                        Site: {props.siteName} 
                    </li>
                    <li>
                        IP Site: {props.siteIP}
                    </li>
                    <li>
                        Date de fin de l'abonnement: {endDate}
                    </li>
                    <li className={`${containerClassEnd}`}>
                        Jours restants: {duree}
                    </li>
                </div>
                <div className="container-site-button-div">
                    <button className="container-site-button" onClick={()=>handleRenouvelerClick()}>Renouveler l'abonnement?</button>
                    <div >
                        {showInputDuree ? 
                        <div className="input-duree-div">
                        <input type="number" placeholder="Durée de l'abonnement"
                        value={renewDuree}
                        onChange={(e) => setRenewDuree(e.target.value)}></input> 
                        <button className="input-duree-button" onClick={handleRenew}>Valider</button>
                        </div>
                        : null}
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
    }

    export default ContainerSite;