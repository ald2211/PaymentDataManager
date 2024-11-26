import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { Success } from "../helpers/popup";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleLogin = async (credentials) => {
    console.log("cred:", credentials);
    authLogin(credentials);
    Success("Welcome to Data Manager");
    navigate("/dashboard");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-7xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-10">
          <div className="text-center">
            <span className="text-white text-[120px] mb-6 block">📊</span>
            <h1 className="text-white text-5xl font-bold drop-shadow-lg">Data Manager</h1>
            <p className="text-white mt-4 text-lg font-medium">
              Simplify your data workflows, securely.
            </p>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center px-6 py-16 bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
              Log In
            </h2>
            <p className="text-gray-600 mb-8">
              Enter your credentials to access your dashboard.
            </p>
            <LoginForm onSubmit={handleLogin} />
          </div>
        </div>
      </div>
    </section>
  );
};
