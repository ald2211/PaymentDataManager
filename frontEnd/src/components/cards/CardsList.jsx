import { useState, useEffect } from "react";
import {
  fetchAllCards,
  createCard,
  updateCard,
  deleteCard,
} from "../../api/cards";
import { ClipLoader } from "react-spinners";
import { Failed, Success } from "../../helpers/popup";

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

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Card Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add, update, or remove payment cards available across the application.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold">
          Total Cards: {cards.length}
        </div>
      </div>

      {/* Add New Card Form */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h3 className="text-base font-semibold text-gray-700 mb-3">
          Add New Card
        </h3>
        <form onSubmit={handleAddCard} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter card name (e.g. ADCB, VISA, HDFC)"
            value={newCardName}
            onChange={(e) => setNewCardName(e.target.value)}
            className="flex-1 p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={addingCard || !newCardName.trim()}
            className="bg-blue-600 text-white px-6 py-2.5 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {addingCard ? (
              <ClipLoader size={18} color="#ffffff" />
            ) : (
              "+ Add Card"
            )}
          </button>
        </form>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-10">
          <ClipLoader size={40} color="#2563eb" />
        </div>
      )}

      {/* Cards Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {cards.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No cards found.</p>
              <p className="text-sm mt-1">
                Add your first card above to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Card Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cards.map((card, index) => (
                    <tr
                      key={card._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900 bg-gray-100 px-2.5 py-1 rounded text-sm">
                          {card.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {card.createdAt
                          ? new Date(card.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => setUpdatingCard(card)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded mr-2 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(card._id)}
                          disabled={deletingId === card._id}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition disabled:opacity-50"
                        >
                          {deletingId === card._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {updatingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Edit Card
            </h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Name
                </label>
                <input
                  type="text"
                  value={updatingCard.name}
                  onChange={(e) =>
                    setUpdatingCard({ ...updatingCard, name: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Card Name"
                  required
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUpdatingCard(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded font-medium transition"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                  disabled={updateLoading || !updatingCard.name.trim()}
                >
                  {updateLoading ? (
                    <>
                      <ClipLoader size={16} color="#ffffff" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Changes"
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
