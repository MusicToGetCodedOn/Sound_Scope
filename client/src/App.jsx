import { useEffect, useState } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/header.jsx';
import useAuth from './hooks/useAuth';

function App() {

  const accessToken = useAuth();

  return (
    <>
      
      <Header token={accessToken} />
      
      <main>
        <Outlet context={{ token: accessToken }} />
      </main>
    </>
  );
};

export default App;