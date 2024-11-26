import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [user,setUser]=useState('')

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    // const storedUser = localStorage.getItem('user');
    // setUser(storedUser || '');
    setLoading(false);
  }, []);

  const login = (credentials) => {
    localStorage.setItem('token', credentials.token);
    // localStorage.setItem('user',credentials.userData.email)
    // setUser(credentials.userData.email)
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    // localStorage.removeItem('user'); 
    // setUser('')
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};