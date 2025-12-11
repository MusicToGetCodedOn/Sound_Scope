import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Wichtig: Importiert unser CSS
import { Outlet } from 'react-router-dom';
import Header from './components/header.jsx';

function App() {
  return (
  <>
  <Header/>
  <main>
    <Outlet/>
  </main>
  </>
  )
};
export default App;