import { useState, useEffect } from 'react';
import { createEntry } from '../../api/entries';
import { fetchAllCards } from '../../api/cards';
import { Failed, Success } from '../../helpers/popup';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentDate } from '../../helpers/currentDate';

const EntryForm = () => {
  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);

  const [formData, setFormData] = useState({
    date: getCurrentDate(), // Default to current date
    card: '',
    consignee: '',
    remark: '',
    amount: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadCards = async () => {
      setLoadingCards(true);
      try {
        const response = await fetchAllCards();
        setCards(response.data || []);
      } catch (error) {
        console.error('Error loading cards:', error);
      } finally {
        setLoadingCards(false);
      }
    };
    loadCards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEntry(formData);
      setFormData({
        date: getCurrentDate(), // Reset to current date
        card: '',
        consignee: '',
        remark: '',
        amount: ''
      });
      Success('New entry added successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding entry:', error);
      Failed('Error adding entry');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <select
          name="card"
          value={formData.card}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          disabled={loadingCards}
        >
          <option value="" disabled>
            {loadingCards ? 'Loading cards...' : 'Select a Card'}
          </option>
          {cards.map((c) => (
            <option key={c._id || c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        {cards.length === 0 && !loadingCards && (
          <p className="text-xs text-amber-600 mt-1">
            No cards available.{' '}
            <Link to="/cards" className="underline font-medium">
              Manage Cards
            </Link>{' '}
            to add one.
          </p>
        )}
      </div>
      <div className="mb-4">
        <input
          type="text"
          name="consignee"
          placeholder="Consignee"
          value={formData.consignee}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          name="remark"
          placeholder="Remark"
          value={formData.remark}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add Entry
      </button>
    </form>
  );
};

export default EntryForm;
