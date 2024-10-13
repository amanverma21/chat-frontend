import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Signup from './components/Signup';
import Login from './components/Login';
import Chat from './components/Chat';
import Logout from './components/Logout';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <nav>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
            {/* <Link to="/chat">Chat</Link> */}
            <Logout />
          </nav>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
