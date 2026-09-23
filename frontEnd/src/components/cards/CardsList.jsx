import { useState, useEffect } from "react";
import {
  fetchAllCards,
  createCard,
  updateCard,
  deleteCard,
} from "../../api/cards";
import { ClipLoader } from "react-spinners";
import { Failed, Success } from "../../helpers/popup";
import {
  FiCreditCard,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiX,
  FiCheck,
} from "react-icons/fi";

const CardsList = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCardName, setNewCardName] = useState("");
  const [addingCard, setAddingCard] = useState(false);
  const [updatingCard, setUpdatingCard] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    try {
      const response = await fetchAllCards();
      setCards(response.data || []);
    } catch (error) {
      console.error("Error loading cards:", error);
      Failed(error.message || "Failed to load cards");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCardName.trim()) return;

    setAddingCard(true);
    try {
      const response = await createCard({ name: newCardName.trim() });
      if (response.data) {
        setCards((prev) =>
          [...prev, response.data].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );
      } else {
        await loadCards();
      }
      setNewCardName("");
      Success("Card added successfully");
    } catch (error) {
      console.error("Error adding card:", error);
      Failed(error.message || "Failed to add card");
    } finally {
      setAddingCard(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updatingCard || !updatingCard.name.trim()) return;

    setUpdateLoading(true);
    try {
      const response = await updateCard(updatingCard._id, {
        name: updatingCard.name.trim(),
      });
      const updatedItem = response.data || updatingCard;
      setCards((prev) =>
        prev
          .map((card) => (card._id === updatingCard._id ? updatedItem : card))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setUpdatingCard(null);
      Success("Card updated successfully");
    } catch (error) {
      console.error("Error updating card:", error);
      Failed(error.message || "Failed to update card");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this card?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteCard(id);
      setCards((prev) => prev.filter((card) => card._id !== id));
      Success("Card deleted successfully");
    } catch (error) {
      console.error("Error deleting card:", error);
      Failed(error.message || "Failed to delete card");
    } finally {
      setDeletingId(null);
    }
  };

  // Card badge color helper
  const getCardBadgeStyle = (cardName) => {
    const hash = (cardName || "")
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      "bg-indigo-50 text-indigo-700 border-indigo-200",
      "bg-emerald-50 text-emerald-700 border-emerald-200",
      "bg-sky-50 text-sky-700 border-sky-200",
      "bg-purple-50 text-purple-700 border-purple-200",
      "bg-amber-50 text-amber-700 border-amber-200",
      "bg-rose-50 text-rose-700 border-rose-200",
      "bg-teal-50 text-teal-700 border-teal-200",
    ];
    return colors[hash % colors.length];
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto animate-fadeIn w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            Card Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage custom payment cards available across entry forms.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs">
          <FiCreditCard className="w-3.5 h-3.5" />
          <span>{cards.length} Cards</span>
        </div>
      </div>

      {/* Add New Card Form */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-2">
          <FiPlus className="w-4 h-4 text-indigo-600" />
          <span>Add New Card</span>
        </h3>
        <form
          onSubmit={handleAddCard}
          className="flex flex-col sm:flex-row gap-2.5 sm:gap-3"
        >
          <div className="relative flex-1">
            <FiCreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="e.g. ADCB, VISA Corporate, Emirates Islamic"
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
              className="w-full pl-10 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={addingCard || !newCardName.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/20 transition disabled:opacity-50 min-w-[110px]"
          >
            {addingCard ? (
              <ClipLoader size={15} color="#ffffff" />
            ) : (
              <>
                <FiPlus className="w-4 h-4" />
                <span>Add Card</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-16">
          <ClipLoader size={44} color="#4f46e5" />
        </div>
      )}

      {/* Cards Display */}
      {!loading && (
        <>
          {cards.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs">
              <div className="w-14 h-14 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-3">
                <FiCreditCard className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                No cards configured yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Add your payment cards above to select them when recording transactions.
              </p>
            </div>
          ) : (
            <>
              {/* MOBILE VIEW (< md): Cards List without Horizontal Overflow */}
              <div className="block md:hidden space-y-2.5">
                {cards.map((card, index) => (
                  <div
                    key={card._id}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-slate-400 w-5 shrink-0">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border truncate ${getCardBadgeStyle(
                          card.name
                        )}`}
                      >
                        {card.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setUpdatingCard(card)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition text-xs font-medium flex items-center gap-1"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(card._id)}
                        disabled={deletingId === card._id}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-50"
                        title="Delete card"
                      >
                        {deletingId === card._id ? (
                          <ClipLoader size={14} color="#e11d48" />
                        ) : (
                          <FiTrash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP VIEW (>= md): Full Table */}
              <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50/80">
                      <tr>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">
                          #
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Card Name
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Created Date
                        </th>
                        <th className="px-6 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cards.map((card, index) => (
                        <tr
                          key={card._id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-400 font-mono">
                            {(index + 1).toString().padStart(2, "0")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getCardBadgeStyle(
                                card.name
                              )}`}
                            >
                              {card.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>
                                {card.createdAt
                                  ? new Date(card.createdAt).toLocaleDateString(
                                      undefined,
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      }
                                    )
                                  : "—"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setUpdatingCard(card)}
                                className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition"
                                title="Edit card"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(card._id)}
                                disabled={deletingId === card._id}
                                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition disabled:opacity-50"
                                title="Delete card"
                              >
                                {deletingId === card._id ? (
                                  <ClipLoader size={14} color="#e11d48" />
                                ) : (
                                  <FiTrash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Edit Modal */}
      {updatingCard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 sm:p-6 animate-scaleUp border border-slate-100 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <FiCreditCard className="w-5 h-5 text-indigo-600" />
                <span>Edit Card</span>
              </h3>
              <button
                onClick={() => setUpdatingCard(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Card Name
                </label>
                <input
                  type="text"
                  value={updatingCard.name}
                  onChange={(e) =>
                    setUpdatingCard({ ...updatingCard, name: e.target.value })
                  }
                  className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition"
                  placeholder="Card Name"
                  required
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUpdatingCard(null)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm shadow-indigo-600/20 transition disabled:opacity-50 flex items-center gap-2"
                  disabled={updateLoading || !updatingCard.name.trim()}
                >
                  {updateLoading ? (
                    <>
                      <ClipLoader size={16} color="#ffffff" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsList;
