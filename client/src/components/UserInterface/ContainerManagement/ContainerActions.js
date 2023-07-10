import React, {useState,useEffect} from "react"; 
import './ContainerActions.css'
import ContainerInfo from "./ContainerInfo/ContainerInfo";
import axios from "axios";

const ContainerActions = () => {

    const [containers, setContainers] = useState([]);

    useEffect(() => {
        // Fetch container data from the Flask server
        fetchContainers();
      }, []);
    
      const fetchContainers = () => {
        // Make an API request to fetch container data
        axios.post('/USERcontainers')
          .then(response => {
            setContainers(response.data);
          })
          .catch(error => {
            console.error('Error fetching container data:', error);
          });
      };

    return (
        <div className="container-actions">
            <div className="container-action-Title">
                <h1 className="container-actions-header">Gestions des sites </h1>
            </div>
            <div className="available-containers">
            {containers.map((container,index) => (
                <div className="container-box" key={index}>
                    <ContainerInfo containerName={container.container_name} containerType={container.container_type} networkDetails={container.container_IP} />
                </div>             
        ))}
                    
            </div>
        </div>
    );
    }

    export default ContainerActions;