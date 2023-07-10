import React from "react";
import './ContainerInfo.css'
import axios from "axios";
import { useState, useEffect } from "react";



const ContainerInfo = (props) => {

    const [status, setStatus] = useState('OFF');
    const containerClass = {status} === 'On' ? 'container-on' : 'container-off';
    var RAM = '128 MB';
    const [CPUcores,setCPUcores] = useState('1');
    const [network_Details,setNetworkDetails] = useState(props.networkDetails);
    const [storage,setStorage] = useState('2GB');
    const [container_name,setContainer_name] = useState(props.containerName);
    const [type,setType] = useState(props.containerType);

    if (type === 'Normal') {
        RAM = '128 MB';
      } else if (type === 'Gold') {
        RAM = '256 MB';
      } else if (type === 'Platinum') {
        RAM = '512 MB';
      }

      const handleTurnOn = () => {
        axios.post('/User-turn-on-container', {container_name })
          .then((response) => {
            console.log(response.data);
            // Handle success
          })
          .catch((error) => {
            console.error(error);
            // Handle error
          });
      };

      const handleTurnOff = () => {
        axios.post('/User-turn-off-container', {container_name })
          .then((response) => {
            console.log(response.data);
            // Handle success
          })
          .catch((error) => {
            console.error(error);
            // Handle error
          });
      };


    return (
        <div >
            <h1 className={`container-info-title ${containerClass}`}>{container_name}</h1>
            <div className="container-info-subDiv">
                <li className={`${containerClass}`}>
                    Status: {status}
                </li>
                <li>
                    RAM: {RAM}
                </li>
                <li>
                    CPU Cores: {CPUcores}
                </li>
                <li>
                    Network details: {network_Details}
                </li>
                <li>
                    Storage: {storage}
                </li>
                <div className="info-buttons">
                    <button className="button-on" onClick={handleTurnOn}>Allumer</button>
                    <button className="button-off" onClick={handleTurnOff}>éteindre</button>
                </div>
            </div>
        </div>
    );
    }

    export default ContainerInfo;