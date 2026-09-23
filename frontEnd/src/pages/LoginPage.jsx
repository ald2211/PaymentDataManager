import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { Success } from "../helpers/popup";
import { FiDatabase, FiCheckCircle } from "react-icons/fi";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleLogin = async (credentials) => {
    authLogin(credentials);
    Success("Welcome to Payment Data Manager");
    navigate("/dashboard");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-100/70 p-4 sm:p-6 selection:bg-indigo-500 selection:text-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-5xl bg-white shadow-xl shadow-slate-200/60 rounded-3xl overflow-hidden border border-slate-200/80 animate-fadeIn">
        {/* Left Branding Section */}
        <div className="lg:col-span-5 relative flex flex-col justify-between bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 sm:p-10 text-white overflow-hidden">
          {/* Subtle background circles */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <FiDatabase className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">Payment Manager</span>
          </div>

          {/* Middle Content */}
          <div className="relative z-10 py-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Streamline Your Payment Workflows.
            </h1>
            <p className="mt-3 text-indigo-100 text-sm leading-relaxed">
              Track consignees, manage dynamic payment cards, and generate instant Excel exports with ease.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-xs text-indigo-100">
                <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dynamic Credit & Debit Card Management</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-indigo-100">
                <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-range Excel & Financial Reports</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-indigo-100">
                <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fast search and real-time dashboard stats</span>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="relative z-10 text-xs text-indigo-200">
            Secure authentication & encrypted data management.
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:col-span-7 flex items-center justify-center p-8 sm:p-12 lg:p-14 bg-white">
          <div className="w-full max-w-md">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Sign In
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                Enter your account credentials to access your dashboard.
              </p>
            </div>

            <LoginForm onSubmit={handleLogin} />
          </div>
        </div>
      </div>
    </section>
  );
};
