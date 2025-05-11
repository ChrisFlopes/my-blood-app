import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import ManageUsers from './pages/ManageUsers';
import ManageBloodWork from './pages/ManageBloodWork';
import PatientPage from './pages/PatientPage';
import AssignPatients from './pages/AssignPatients';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  const ProtectedRoute = ({ children }) => {
    return authToken ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={ <Register /> } />
        <Route path="/login" element={ <Login setAuthToken={setAuthToken} /> } />

        <Route path="/manage-users" element={
          <ProtectedRoute>
            <ManageUsers />
          </ProtectedRoute>
        }/>
        <Route path="/manage-blood-work" element={
          <ProtectedRoute>
            <ManageBloodWork />
          </ProtectedRoute>
        }/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }/>
        <Route path="/patients/:id" element={
          <ProtectedRoute>
            <PatientPage />
          </ProtectedRoute>
        }/>
        <Route path="/doctors/:doctorId/assign-patients" element={
          <ProtectedRoute>
            <AssignPatients />
          </ProtectedRoute>
        }/>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;