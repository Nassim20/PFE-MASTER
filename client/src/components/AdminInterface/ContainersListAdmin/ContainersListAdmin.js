import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import "./ContainersListAdmin.css";
import ContainerInfo from "./ContainerInfo/ContainerInfo";

const ContainersListAdmin = () => {

    const [containers, setContainers] = useState([]);

    useEffect(() => {
        axios.get('/api/containers')
        .then(response => {
            setContainers(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    return(
        <div className="containers-list-admin">
            <h1> Liste des containers </h1>
            <div className="containers-list">
            {containers.map((container,index) => (
                <li key={index}>
                <div className="container-div">
                <ContainerInfo containerId={container.container_ID} containerIp={container.container_IP} hostLength={container.Duree} userOwner={container.Username}/>
            </div>
            </li>
            ))}
                
            </div>  
        </div>
    );
}

export default ContainersListAdmin;