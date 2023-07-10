import React from 'react';
import { useState} from 'react';
import './AdminInterface.css'
import TopbarAdmin from './TopbarAdmin/TopbarAdmin';
import SidebarAdmin from './SidebarAdmin/SidebarAdmin';
import Homepage from './Homepage/Homepage';
import CreateContainer from './CreateContainer/CreateContainer';
import UserList from './UserList/UserList';
import ContainersListAdmin from './ContainersListAdmin/ContainersListAdmin';

const AdminInterface = () => {

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  const [activeComponent, setActiveComponent] = useState('Home');
  
  const renderComponent = () => {
    switch (activeComponent) {
      case 'Home':
        return <Homepage handleComponentChange={handleComponentChange}/>;
      case 'Createcontainer':
        return <CreateContainer/>;
      case 'Userlist':
        return <UserList />;
      case 'Containerslist':
        return <ContainersListAdmin />;
      default:
        return <h1>Error</h1>;
    }
  };

  return (
    
    <div className="root-div-admin">
        <div className="topbar-div-admin">
          <TopbarAdmin handleComponentChange={handleComponentChange}/>
        </div>
      <div className="main-content-admin">
        <div className="sidebar-div-admin">
          <SidebarAdmin handleComponentChange={handleComponentChange}/>
        </div>
        <div className="main-div-admin">
        {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default AdminInterface;