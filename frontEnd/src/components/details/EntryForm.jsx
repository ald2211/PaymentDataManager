import { useState } from 'react';
import { createEntry } from '../../api/entries';
import { Failed, Success } from '../../helpers/popup';
import { useNavigate } from 'react-router-dom';

const EntryForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    card: '',
    consignee: '',
    remark: '',
    amount: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEntry(formData);
      setFormData({
        date: '',
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
        >
          <option value="" disabled>Select a Card</option>
          <option value="ADCB">ADCB</option>
          <option value="CITY">CITY</option>
          <option value="ASEEL">ASEEL</option>
          <option value="NBD">NBD</option>
          <option value="RAK RED">RAK RED</option>
          <option value="RAK TIANIUM">RAK TIANIUM</option>
          <option value="SHARJH ISLAMIC">SHARJH ISLAMIC</option>
          <option value="OTHER">OTHER</option>
        </select>
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
