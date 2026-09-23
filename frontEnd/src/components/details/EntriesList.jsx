import { useState, useEffect, useMemo } from "react";
import {
  convertToExcel,
  deleteAnEntry,
  fetchAllEntries,
  updateAnEntry,
} from "../../api/entries";
import { fetchAllCards } from "../../api/cards";
import { ClipLoader } from "react-spinners";
import { formatDate } from "../../helpers/formatDate";
import { Failed, Success } from "../../helpers/popup";
import { useNavigate } from "react-router-dom";
import {
  FiDownload,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiLayers,
  FiTrendingUp,
  FiX,
  FiCalendar,
  FiCreditCard,
  FiUser,
  FiFileText,
} from "react-icons/fi";

const EntriesList = () => {
  const [entries, setEntries] = useState([]);
  const [cards, setCards] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCardFilter, setSelectedCardFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [updatingEntry, setUpdatingEntry] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetchAllCards();
      setCards(response.data || []);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await fetchAllEntries();
      setEntries(response.data || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
      Failed("Failed to fetch entries");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment entry?")) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteAnEntry(id);
      setEntries((prev) => prev.filter((entry) => entry._id !== id));
      Success("Entry deleted successfully");
    } catch (error) {
      console.error("Error deleting entry:", error);
      Failed("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const response = await convertToExcel(startDate, endDate);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `entries_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Success("Excel file exported successfully");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Failed("Export failed");
    } finally {
      setExportLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!updatingEntry) return;
    setUpdateLoading(true);
    try {
      await updateAnEntry(updatingEntry._id, updatingEntry);
      setEntries((prev) =>
        prev.map((entry) =>
          entry._id === updatingEntry._id ? updatingEntry : entry
        )
      );
      setUpdatingEntry(null);
      Success("Entry updated successfully");
    } catch (error) {
      console.error("Error updating entry:", error);
      Failed("Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Date filter
      if (startDate) {
        const entryDate = new Date(entry.date).toISOString().slice(0, 10);
        if (entryDate < startDate) return false;
      }
      if (endDate) {
        const entryDate = new Date(entry.date).toISOString().slice(0, 10);
        if (entryDate > endDate) return false;
      }

      // Card filter
      if (selectedCardFilter !== "ALL" && entry.card !== selectedCardFilter) {
        return false;
      }

      // Search query (consignee, remark, card, amount)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesConsignee = entry.consignee?.toLowerCase().includes(q);
        const matchesRemark = entry.remark?.toLowerCase().includes(q);
        const matchesCard = entry.card?.toLowerCase().includes(q);
        const matchesAmount = entry.amount?.toString().includes(q);
        if (
          !matchesConsignee &&
          !matchesRemark &&
          !matchesCard &&
          !matchesAmount
        ) {
          return false;
        }
      }

      return true;
    });
  }, [entries, startDate, endDate, selectedCardFilter, searchQuery]);

  // Total summary statistics in AED
  const totalAmount = useMemo(() => {
    return filteredEntries.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );
  }, [filteredEntries]);

  const avgAmount = useMemo(() => {
    return filteredEntries.length > 0
      ? totalAmount / filteredEntries.length
      : 0;
  }, [filteredEntries, totalAmount]);

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
    setSelectedCardFilter("ALL");
  };

  const hasActiveFilters =
    startDate || endDate || searchQuery || selectedCardFilter !== "ALL";

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
    <div className="space-y-5 sm:space-y-6 animate-fadeIn w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            Payment Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track and manage all transactions in AED (UAE Dirham).
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => navigate("/entry/new")}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-500/25 transition duration-150"
          >
            <FiPlus className="w-4 h-4 shrink-0" />
            <span>New Entry</span>
          </button>
          <button
            onClick={handleExport}
            disabled={exportLoading || entries.length === 0}
            className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-emerald-600/20 transition duration-150 disabled:opacity-50"
          >
            {exportLoading ? (
              <ClipLoader size={15} color="#ffffff" />
            ) : (
              <FiDownload className="w-4 h-4 shrink-0" />
            )}
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 min-w-0">
          <div className="p-2.5 sm:p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
            <FiLayers className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Total Entries
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              {filteredEntries.length}
              {filteredEntries.length !== entries.length && (
                <span className="text-xs font-normal text-slate-400 ml-1">
                  / {entries.length}
                </span>
              )}
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 min-w-0">
          <div className="p-2.5 sm:p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <span className="text-xs font-extrabold font-mono leading-none">AED</span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Total Amount
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              <span className="text-xs font-semibold text-slate-500 mr-1 font-sans">
                AED
              </span>
              {totalAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 min-w-0">
          <div className="p-2.5 sm:p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
            <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Average / Entry
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              <span className="text-xs font-semibold text-slate-500 mr-1 font-sans">
                AED
              </span>
              {avgAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3">
          {/* Search Query */}
          <div className="sm:col-span-2 lg:col-span-4 relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search consignee, remark, card..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* Card Filter */}
          <div className="sm:col-span-1 lg:col-span-3">
            <select
              value={selectedCardFilter}
              onChange={(e) => setSelectedCardFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition"
            >
              <option value="ALL">All Cards</option>
              {cards.map((c) => (
                <option key={c._id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Start */}
          <div className="sm:col-span-1 lg:col-span-2">
            <input
              type="date"
              title="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full py-2 px-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition text-slate-700"
            />
          </div>

          {/* Date Range End */}
          <div className="sm:col-span-1 lg:col-span-2">
            <input
              type="date"
              title="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full py-2 px-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition text-slate-700"
            />
          </div>

          {/* Clear Filters */}
          <div className="sm:col-span-1 lg:col-span-1 flex items-center">
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="w-full py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition flex items-center justify-center gap-1"
                title="Reset all filters"
              >
                <FiX className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            ) : (
              <div className="hidden lg:flex w-full items-center justify-center text-slate-400 text-xs">
                <FiFilter className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-16">
          <ClipLoader size={44} color="#4f46e5" />
        </div>
      )}

      {/* Content Section: Mobile Cards vs Desktop Table */}
      {!loading && (
        <>
          {filteredEntries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs">
              <div className="w-14 h-14 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-3">
                <FiLayers className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                No payment entries found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                {hasActiveFilters
                  ? "No transactions match your active filters. Try clearing filters."
                  : "You haven't recorded any payments yet. Click below to add one."}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-xl transition"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => navigate("/entry/new")}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition inline-flex items-center gap-2 shadow-sm shadow-indigo-600/20"
                >
                  <FiPlus className="w-4 h-4" /> Add Payment Entry
                </button>
              )}
            </div>
          ) : (
            <>
              {/* MOBILE VIEW (< md): Responsive Cards without Horizontal Scrolling */}
              <div className="block md:hidden space-y-3">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry._id}
                    className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition"
                  >
                    {/* Top Row: Date & Card Badge */}
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(entry.date).toLocaleDateString(undefined, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getCardBadgeStyle(
                          entry.card
                        )}`}
                      >
                        {entry.card}
                      </span>
                    </div>

                    {/* Middle Row: Consignee & Remark */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <FiUser className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{entry.consignee}</span>
                      </h4>
                      {entry.remark && (
                        <p className="text-xs text-slate-500 mt-1 flex items-start gap-1.5 pl-5">
                          <span className="italic">{entry.remark}</span>
                        </p>
                      )}
                    </div>

                    {/* Bottom Row: Amount & Actions */}
                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Amount
                        </span>
                        <div className="text-base font-extrabold text-slate-900 font-mono">
                          <span className="text-xs font-semibold text-slate-500 mr-1 font-sans">
                            AED
                          </span>
                          {Number(entry.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setUpdatingEntry(entry)}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          disabled={deletingId === entry._id}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs transition disabled:opacity-50"
                          title="Delete entry"
                        >
                          {deletingId === entry._id ? (
                            <ClipLoader size={14} color="#e11d48" />
                          ) : (
                            <FiTrash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP VIEW (>= md): Full Responsive Table */}
              <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50/80">
                      <tr>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Card
                        </th>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Consignee
                        </th>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Remark
                        </th>
                        <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Amount (AED)
                        </th>
                        <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEntries.map((entry) => (
                        <tr
                          key={entry._id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                            <div className="flex items-center gap-1.5">
                              <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(entry.date).toLocaleDateString(
                                undefined,
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCardBadgeStyle(
                                entry.card
                              )}`}
                            >
                              {entry.card}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                            {entry.consignee}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-500 max-w-xs truncate">
                            {entry.remark || "—"}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-slate-900 text-right font-mono">
                            <span className="text-xs font-semibold text-slate-400 mr-1 font-sans">
                              AED
                            </span>
                            {Number(entry.amount).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setUpdatingEntry(entry)}
                                className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition"
                                title="Edit entry"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(entry._id)}
                                disabled={deletingId === entry._id}
                                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition disabled:opacity-50"
                                title="Delete entry"
                              >
                                {deletingId === entry._id ? (
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

      {/* Edit Entry Modal */}
      {updatingEntry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-5 sm:p-7 animate-scaleUp border border-slate-100 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Update Payment Entry
              </h3>
              <button
                onClick={() => setUpdatingEntry(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={formatDate(updatingEntry.date)}
                  onChange={(e) =>
                    setUpdatingEntry({ ...updatingEntry, date: e.target.value })
                  }
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Card
                </label>
                <select
                  value={updatingEntry.card}
                  onChange={(e) =>
                    setUpdatingEntry({ ...updatingEntry, card: e.target.value })
                  }
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition"
                  required
                >
                  <option value="" disabled>
                    Select a Card
                  </option>
                  {updatingEntry.card &&
                    !cards.some((c) => c.name === updatingEntry.card) && (
                      <option value={updatingEntry.card}>
                        {updatingEntry.card} (legacy)
                      </option>
                    )}
                  {cards.map((c) => (
                    <option key={c._id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Consignee
                </label>
                <input
                  type="text"
                  value={updatingEntry.consignee}
                  onChange={(e) =>
                    setUpdatingEntry({
                      ...updatingEntry,
                      consignee: e.target.value,
                    })
                  }
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition"
                  placeholder="Consignee name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Remark
                </label>
                <input
                  type="text"
                  value={updatingEntry.remark || ""}
                  onChange={(e) =>
                    setUpdatingEntry({
                      ...updatingEntry,
                      remark: e.target.value,
                    })
                  }
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition"
                  placeholder="Optional notes or remarks"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Amount (AED)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    AED
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={updatingEntry.amount}
                    onChange={(e) =>
                      setUpdatingEntry({
                        ...updatingEntry,
                        amount: parseFloat(e.target.value) || "",
                      })
                    }
                    className="w-full pl-12 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition font-mono font-semibold"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUpdatingEntry(null)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm shadow-indigo-600/20 transition disabled:opacity-50 flex items-center gap-2"
                  disabled={updateLoading}
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

export default EntriesList;
