import { useNavigate } from "react-router-dom";
import Button from "../components/reUsable/Button";


export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-blue-500 p-4 text-white"
    >
      {/* Overlay for better contrast */}
      <div className="absolute "></div>

      {/* Content */}
      <div className="relative text-center text-white p-6 md:p-10 max-w-xl mx-auto rounded-lg ">
        <h1 className="text-5xl font-extrabold mb-6 leading-tight text-black">
          Welcome to <span className="text-indigo-500">Data Manager</span>
        </h1>
        <p className="text-lg text-black mb-10">
          Simplify your Data management with our powerful tools and features.
        </p>

        <div className="space-x-4">
          {/* Primary Button */}
          <Button
            className="px-6 py-3 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition duration-300 hidden"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
          {/* Secondary Button */}
          <Button
            className="px-6 py-3 rounded-lg font-semibold border border-indigo-600 hover:bg-indigo-600 hover:text-white transition duration-300"
            variant="outline"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};
