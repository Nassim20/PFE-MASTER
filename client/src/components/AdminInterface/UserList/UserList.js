import React from "react";
import { useState ,useEffect} from "react";
import axios from "axios";
import "./UserList.css";
import UserInfo from "./UserInfo/UserInfo";

const UserList = () => {
    const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

    return(
        <div className="user-list">
            <h1> Liste des utilisateurs </h1>
            <div className="users-info-list">
            {users.map((user,index) => (
              <li key={index}>
                <UserInfo username={user.username} password={user.password} email={user.email} numSites={user.container_count}/>
              </li>
            ))}
            </div>
        </div>
    );
}

export default UserList;