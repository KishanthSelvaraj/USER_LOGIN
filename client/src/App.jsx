// App.js
import React, { useEffect } from 'react';
import { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import ForgotPassword from './ForgotPassword';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Resetpass from './Resetpass';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn]);

  return (
    <BrowserRouter>
      <Routes>
        {loggedIn ? (
          <>
            <Route path="/" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:id/:token" element={< Resetpass/>} />
          </>
        ) : (
          <>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:id/:token" element={<Resetpass />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
