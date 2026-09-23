import { Routes, Route, Navigate } from "react-router-dom";

import { PrivateRoute } from "./components/auth/PrivateRoute";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
// import { SignupPage } from "./pages/SignupPage";
import Dashboard from "./pages/DashboardPage";
import { PublicRoute } from "./components/auth/PublicRoute";
import AddEntry from "./pages/AddEntry";
import CardsPage from "./pages/CardsPage";

const App = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/signup" element={<SignupPage />} /> */}
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/entry/new" element={<AddEntry />} />
        <Route path="/cards" element={<CardsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
