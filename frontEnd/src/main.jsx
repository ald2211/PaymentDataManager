import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import './index.css'
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './context/AuthContext.jsx';


createRoot(document.getElementById('root')).render(
    
    <AuthProvider>
    <BrowserRouter>
    <ToastContainer />
    <App />
    </BrowserRouter>
    </AuthProvider>
)
