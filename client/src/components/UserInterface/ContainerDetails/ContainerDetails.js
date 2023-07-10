import React from "react";
import ContainerSite from "./ContainerSite/ContainerSite";
import './ContainerDetails.css'
import axios from 'axios';
import { useState ,useEffect} from "react";


const ContainerDetails = () => {

    const [username, setUsername] = useState('');
    const [containers, setContainers] = useState([]);

    useEffect(() => {
        // Fetch containers when the component mounts
        fetchContainers();
      }, []);

    const fetchContainers = () => {
      // Send a POST request to the Flask server to fetch containers by username
      axios.post('/container_list')
        .then(response => {
          // Set the fetched containers to the state
          setContainers(response.data);
        })
        .catch(error => {
          // Handle error
          console.error(error);
        });
    };



    return (
        <div className="container-details-div">
            <h1 className="container-details-title">Liste des Sites </h1>
                <div className="containers liste">                  
                {containers.map(container  => (
                    <div key={container.container_name}>
                        <ContainerSite siteName ={container.container_name} siteIP={container.container_ip} duree={container.duree} />
                    </div>
                ))}
                    

                </div>
        </div>
    );
    }

    export default ContainerDetails;