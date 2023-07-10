import React , {useEffect,useState}from "react";
import axios from "axios";
import './RequestsList.css'

const RequestsList = ({requestclick ,goBack}) => {


      const [requests, setRequests] = useState([]);

      useEffect(() => {
        fetchRequests();
      }, []);

    const fetchRequests = async () => {
        try {
          const response = await axios.get('/api/requests'); // Adjust the API endpoint according to your Flask server setup
          setRequests(response.data);
        } catch (error) {
          console.error('Error fetching requests:', error);
        }
  };


    return (
        <div className="requests-list-container">
          <h2>Liste des demandes de creation</h2>
          <ul className="requests-list">
          {requests.map((request, index) => (
              <li key={index}>
                <div>
                    <span className="username"> Utilisateur: {request.username}</span>
                    <span className="container-type">Type d'abonnement: {request.type}</span>
                    <span className="hosting-length">Durée(jours): {request.duree}</span>
                    <button className="afficher-button" onClick={()=>requestclick(request.username,request.type,request.duree)}>Afficher</button>
                </div>
              </li>
            ))}
          </ul>

          <button className="goBack-button" onClick={goBack}>Retour</button>
        </div>
      );
    }

export default RequestsList;