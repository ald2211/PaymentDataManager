import { useState, useEffect } from 'react';
import { convertToExcel, deleteAnEntry, fetchAllEntries, updateAnEntry } from '../../api/entries';
import { ClipLoader } from 'react-spinners';
import { formatDate } from '../../helpers/formatDate';
import { Failed, Success } from '../../helpers/popup';

const EntriesList = () => {
  const [entries, setEntries] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatingEntry, setUpdatingEntry] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const cardOptions = [
    'ADCB',
    'CITY',
    'ASEEL',
    'NBD',
    'RAK RED',
    'RAK TITANIUM',
    'SHARJH ISLAMIC',
    'OTHER',
  ];

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await fetchAllEntries();
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteAnEntry(id);
      setEntries(entries.filter((entry) => entry._id !== id));
      Success('Entry deleted successfully')
    } catch (error) {
      console.error('Error deleting entry:', error);
      Failed('delete failed')
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await convertToExcel(startDate, endDate);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'entries.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!updatingEntry) return;
    setUpdateLoading(true);
    try {
      await updateAnEntry(updatingEntry._id, updatingEntry);
      setEntries(entries.map((entry) => (entry._id === updatingEntry._id ? updatingEntry : entry)));
      setUpdatingEntry(null);
      Success('entry updated successfully')
    } catch (error) {
      console.error('Error updating entry:', error);
      Failed('updation failed')
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="p-4">
      {loading && (
        <div className="flex justify-center mb-4">
          <ClipLoader size={50} color="#36d7b7" />
        </div>
      )}

      <div className="mb-4 flex gap-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Export to Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Card</th>
              <th className="border p-2 text-left">Consignee</th>
              <th className="border p-2 text-left">Remark</th>
              <th className="border p-2 text-right">Amount</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries?.map((entry) => (
              <tr key={entry._id} className="hover:bg-gray-50">
                <td className="border p-2">{new Date(entry.date).toLocaleDateString()}</td>
                <td className="border p-2">{entry.card}</td>
                <td className="border p-2">{entry.consignee}</td>
                <td className="border p-2">{entry.remark}</td>
                <td className="border p-2 text-right">{entry.amount}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => setUpdatingEntry(entry)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {updatingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Update Entry</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <input
                type="date"
                value={formatDate(updatingEntry.date)}
                onChange={(e) => setUpdatingEntry({ ...updatingEntry, date: e.target.value })}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <select
                value={updatingEntry.card}
                onChange={(e) => setUpdatingEntry({ ...updatingEntry, card: e.target.value })}
                className="w-full mb-3 p-2 border rounded"
                required
              >
                {cardOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={updatingEntry.consignee}
                onChange={(e) => setUpdatingEntry({ ...updatingEntry, consignee: e.target.value })}
                className="w-full mb-3 p-2 border rounded"
                placeholder="Consignee"
                required
              />
              <input
                type="text"
                value={updatingEntry.remark}
                onChange={(e) => setUpdatingEntry({ ...updatingEntry, remark: e.target.value })}
                className="w-full mb-3 p-2 border rounded"
                placeholder="Remark"
              />
              <input
                type="number"
                value={updatingEntry.amount}
                onChange={(e) =>
                  setUpdatingEntry({ ...updatingEntry, amount: parseFloat(e.target.value) || '' })
                }
                className="w-full mb-3 p-2 border rounded"
                placeholder="Amount"
                required
              />
              <button
                type="submit"
                className={`w-full bg-blue-500 text-white p-2 rounded ${
                  updateLoading ? 'opacity-50' : 'hover:bg-blue-600'
                }`}
                disabled={updateLoading}
              >
                {updateLoading ? 'Updating...' : 'Update Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntriesList;
