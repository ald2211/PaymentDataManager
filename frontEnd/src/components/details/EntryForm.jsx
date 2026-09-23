import { useState, useEffect } from "react";
import { createEntry } from "../../api/entries";
import { fetchAllCards } from "../../api/cards";
import { Failed, Success } from "../../helpers/popup";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentDate } from "../../helpers/currentDate";
import { ClipLoader } from "react-spinners";
import {
  FiCalendar,
  FiCreditCard,
  FiUser,
  FiFileText,
  FiArrowLeft,
  FiPlus,
  FiCheck,
} from "react-icons/fi";

const EntryForm = () => {
  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: getCurrentDate(),
    card: "",
    consignee: "",
    remark: "",
    amount: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadCards = async () => {
      setLoadingCards(true);
      try {
        const response = await fetchAllCards();
        const cardList = response.data || [];
        setCards(cardList);
        if (cardList.length > 0 && !formData.card) {
          setFormData((prev) => ({ ...prev, card: cardList[0].name }));
        }
      } catch (error) {
        console.error("Error loading cards:", error);
      } finally {
        setLoadingCards(false);
      }
    };
    loadCards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.card) {
      Failed("Please select a card");
      return;
    }

    setSubmitting(true);
    try {
      await createEntry(formData);
      Success("New payment entry added successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding entry:", error);
      Failed(error.message || "Error adding entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 mb-3 sm:mb-4 transition"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Main Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 px-5 sm:px-8 py-5 sm:py-6 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white shrink-0">
              <FiPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Add New Payment Entry</h2>
              <p className="text-xs sm:text-sm text-indigo-100 mt-0.5">
                Record transaction details in AED.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Date Field */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Date</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition text-slate-800 font-medium"
                required
              />
            </div>

            {/* Card Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <FiCreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>Card</span>
                  <span className="text-rose-500">*</span>
                </label>
                <Link
                  to="/cards"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-0.5"
                >
                  <FiPlus className="w-3 h-3" /> Manage
                </Link>
              </div>
              <select
                name="card"
                value={formData.card}
                onChange={handleChange}
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition text-slate-800 font-medium"
                required
                disabled={loadingCards}
              >
                <option value="" disabled>
                  {loadingCards ? "Loading cards..." : "Select a Card"}
                </option>
                {cards.map((c) => (
                  <option key={c._id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Consignee Field */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              <FiUser className="w-3.5 h-3.5 text-slate-400" />
              <span>Consignee</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="consignee"
              placeholder="e.g. Amazon AE, Supplier Name, Etisalat"
              value={formData.consignee}
              onChange={handleChange}
              className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition text-slate-800"
              required
            />
          </div>

          {/* Remark Field */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              <FiFileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Remark</span>
              <span className="text-xs font-normal lowercase text-slate-400">
                (optional)
              </span>
            </label>
            <input
              type="text"
              name="remark"
              placeholder="e.g. Monthly maintenance invoice #581"
              value={formData.remark}
              onChange={handleChange}
              className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition text-slate-800"
            />
          </div>

          {/* Amount Field (AED) */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              <span className="text-xs font-bold text-slate-500">AED</span>
              <span>Amount (AED)</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 select-none">
                AED
              </span>
              <input
                type="number"
                step="any"
                name="amount"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-2.5 text-sm sm:text-base font-bold font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition text-slate-900"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition text-center"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <ClipLoader size={16} color="#ffffff" />
                  <span>Saving Entry...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  <span>Save Payment Entry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryForm;
