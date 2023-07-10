import React ,{useEffect,useState}from "react";
import './NewRequestsList.css'
import axios from "axios";
import NewRequestItem from "./NewRequestItem";

const NewRequestsList = ({goBack}) => {

      const [requests, setRequests] = useState([]);


      useEffect(() => {
        fetchRequests();
      }, []);

    const fetchRequests = async () => {
        try {
          const response = await axios.get('/api/Renewrequests'); // Adjust the API endpoint according to your Flask server setup
          setRequests(response.data);
        } catch (error) {
          console.error('Error fetching requests:', error);
        }
  };

    return (
        <div className="requests-list-container">
          <h2>Liste des demandes de renouvelement</h2>
          <ul className="requests-list">
          {requests.map((request, index) => (
              <li key={index}>
                <NewRequestItem {...request} />
              </li>
            ))}
          </ul>

          <button className="goBack-button" onClick={goBack}>Retour</button>
        </div>
        );
          }



export default NewRequestsList;