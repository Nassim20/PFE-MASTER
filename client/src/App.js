import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './components/Login/Login';
import CreateAccountForm from './components/CreateAccount/CreateAccount';
import UserInterface from './components/UserInterface/UserInterface';
import AdminInterface from './components/AdminInterface/AdminInterface';

const App = () => {
  return (
    <>
       <Routes>
          <Route path="/UserHome" element={<UserInterface />} />
          <Route path="/AdminHome" element={<AdminInterface />} />
          <Route path="/" element={<LoginForm />} />
          <Route path="/CreateAccount" element={<CreateAccountForm />} />
       </Routes>
    </>

  );
};

export default App;