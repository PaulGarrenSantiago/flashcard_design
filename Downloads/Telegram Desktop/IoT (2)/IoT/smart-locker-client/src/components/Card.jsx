import { useState, useEffect } from 'react';

function Card() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    rfid_uid: '',
    status: 'inactive'
  });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/cards/');
      const result = await res.json();
      if (result.success) {
        setCards(result.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setMessage('Error loading cards');
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.rfid_uid) {
      setMessage('RFID UID is required');
      return;
    }

    try {
      const url = editingCard ? `/api/cards/${editingCard._id}` : '/api/cards/';
      const method = editingCard ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (result.success) {
        setMessage(`Card ${editingCard ? 'updated' : 'created'} successfully!`);
        setFormData({ rfid_uid: '', status: 'inactive' });
        setEditingCard(null);
        setShowForm(false);
        fetchCards();
      } else {
        setMessage(result.message || 'Error saving card');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error saving card');
    }
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setFormData({
      rfid_uid: card.rfid_uid,
      status: card.status
    });
    setShowForm(true);
  };

  const handleToggleStatus = async (cardId, currentStatus) => {
    try {
      const res = await fetch(`/api/cards/toggle/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await res.json();

      if (result.success) {
        setMessage(`Card ${result.data.status === 'active' ? 'activated' : 'deactivated'} successfully!`);
        fetchCards();
      } else {
        setMessage(result.message || 'Error toggling card status');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error toggling card status');
    }
  };

  const handleDelete = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;

    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE'
      });

      const result = await res.json();

      if (result.success) {
        setMessage('Card deleted successfully!');
        fetchCards();
      } else {
        setMessage(result.message || 'Error deleting card');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error deleting card');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCard(null);
    setFormData({ rfid_uid: '', status: 'inactive' });
  };

  if (loading) return <div className="max-w-6xl mx-auto mt-10 p-6">Loading cards...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Cards</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            + Add Card
          </button>
        )}
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md ${
            message.includes('success') || message.includes('successfully')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      {showForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold mb-4">
            {editingCard ? 'Edit Card' : 'Add New Card'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">RFID UID *</label>
              <input
                type="text"
                name="rfid_uid"
                value={formData.rfid_uid}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter card RFID UID"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: 2345B238, 43291839
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Set to "Inactive" if card is lost or needs to be disabled
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                {editingCard ? 'Update Card' : 'Create Card'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cards Table */}
      <div className="overflow-x-auto">
        {cards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No cards found. Click "Add Card" to create one.
          </div>
        ) : (
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">RFID UID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Assigned to User</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.map(card => (
                <tr key={card._id} className="border-t hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-mono font-semibold">
                    {card.rfid_uid}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        card.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {card.status === 'active' ? '✓ Active' : '✗ Inactive'}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {card.assigned_user_id ? (
                      <div className="text-sm">
                        <p className="font-medium">{card.assigned_user_id.name}</p>
                        <p className="text-gray-500 text-xs">{card.assigned_user_id.email}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Not assigned</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={() => handleToggleStatus(card._id, card.status)}
                        className={`py-1 px-3 rounded text-sm text-white font-medium ${
                          card.status === 'active'
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {card.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleEdit(card)}
                        className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(card._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Card Management Info:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Active cards</strong> can be used to access assigned lockers</li>
          <li>• <strong>Inactive cards</strong> will be denied access even if tapped (useful for lost cards)</li>
          <li>• Cards must be added before assigning them to users</li>
          <li>• You can change a card's status to disable it without deleting</li>
        </ul>
      </div>
    </div>
  );
}

export default Card;
