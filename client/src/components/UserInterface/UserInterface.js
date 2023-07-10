import React from 'react';
import { useState } from 'react';
import MainContent from './MainContent/MainContent';
import './UserInterface.css'
import Subscriptionpage from './Subscription choice/Subscriptionpage';
import Topbar from './Topbar/Topbar';
import Sidebar from './Sidebar/Sidebar';
import ContainerActions from './ContainerManagement/ContainerActions';
import ContainerDetails from './ContainerDetails/ContainerDetails';



const UserInterface = () => {

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  const [activeComponent, setActiveComponent] = useState('Home');
  
  const renderComponent = () => {
    switch (activeComponent) {
      case 'Home':
        return <MainContent handleComponentChange={handleComponentChange}/>;
      case 'subscription':
        return <Subscriptionpage />;
      case 'containers':
        return <ContainerActions />;
      case 'container_details':
        return <ContainerDetails />;
      default:
        return <h1>Error</h1>;
    }
  };

  return (
    
    <div className="root-div">
        <div className="topbar-div">
          <Topbar handleComponentChange={handleComponentChange}/>
        </div>
      <div className="main-content">
        <div className="sidebar-div">
          <Sidebar handleComponentChange={handleComponentChange}/>
        </div>
        <div className="main-div">
        {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default UserInterface;