import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCreditCard, FiDatabase, FiFileText, FiShield } from "react-icons/fi";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col justify-between relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <FiDatabase className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Payment Data Manager</span>
        </div>
        <div>
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition duration-200"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-12 sm:py-20 text-center relative z-10 animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>Professional Payment Tracking & Management</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Manage Payments & Cards with Effortless Precision
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Record payment transactions, organize custom credit & debit cards dynamically, and export structured Excel reports in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-2xl font-bold text-base shadow-xl shadow-indigo-500/25 transition duration-200"
          >
            <span>Get Started</span>
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <FiCreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Dynamic Cards</h3>
            <p className="text-xs text-slate-400">
              Create, update, and manage your card list in real time without hardcoded restrictions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <FiFileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Instant Excel Export</h3>
            <p className="text-xs text-slate-400">
              Export filtered transactions by custom date ranges directly into clean spreadsheets.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <FiShield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Secure & Fast</h3>
            <p className="text-xs text-slate-400">
              Protected authentication and fast MongoDB integration keep your payment records safe.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-500 relative z-10 border-t border-white/5">
        &copy; {new Date().getFullYear()} Payment Data Manager. All rights reserved.
      </footer>
    </div>
  );
};
