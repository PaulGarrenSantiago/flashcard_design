import { useState, useEffect } from 'react';

function Avail() {
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rfid_id: ''
  });

  // Fetch users and available cards on mount
  useEffect(() => {
    fetchUsers();
    fetchAvailableCards();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users/');
      const result = await res.json();
      if (result.success) {
        setUsers(result.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setMessage('Error loading users');
      setLoading(false);
    }
  };

  const fetchAvailableCards = async () => {
    try {
      const res = await fetch('/api/users/cards/available');
      const result = await res.json();
      if (result.success) {
        setCards(result.data);
      }
    } catch (err) {
      console.error(err);
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

    if (!formData.name || !formData.email) {
      setMessage('Name and email are required');
      return;
    }

    try {
      const url = editingUser ? `/api/users/${editingUser._id}` : '/api/users/';
      const method = editingUser ? 'PUT' : 'POST';
      const body = {
        name: formData.name,
        email: formData.email,
        rfid_id: formData.rfid_id || null
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await res.json();

      if (result.success) {
        setMessage(`User ${editingUser ? 'updated' : 'created'} successfully!`);
        setFormData({ name: '', email: '', rfid_id: '' });
        setEditingUser(null);
        setShowForm(false);
        fetchUsers();
        fetchAvailableCards();
      } else {
        setMessage(result.message || 'Error saving user');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error saving user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      rfid_id: user.rfid_id?._id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      const result = await res.json();

      if (result.success) {
        setMessage('User deleted successfully!');
        fetchUsers();
        fetchAvailableCards();
      } else {
        setMessage(result.message || 'Error deleting user');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error deleting user');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', rfid_id: '' });
  };

  if (loading) return <div className="max-w-6xl mx-auto mt-10 p-6">Loading users...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Users & Cards</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            + Add User
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
            {editingUser ? 'Edit User' : 'Add New User'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter user name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter user email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Assign Card (Optional)</label>
              <select
                name="rfid_id"
                value={formData.rfid_id}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">No card assigned</option>
                {editingUser && editingUser.rfid_id && (
                  <option value={editingUser.rfid_id._id}>
                    Current: {editingUser.rfid_id.rfid_uid}
                  </option>
                )}
                {cards.map(card => (
                  <option key={card._id} value={card._id}>
                    {card.rfid_uid} ({card.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                {editingUser ? 'Update User' : 'Create User'}
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

      {/* Users Table */}
      <div className="overflow-x-auto">
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users found. Click "Add User" to create one.
          </div>
        ) : (
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Assigned Card</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    {user.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.rfid_id ? (
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-mono">
                        {user.rfid_id.rfid_uid}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">No card assigned</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded text-sm hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
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
    </div>
  );
}

export default Avail;
