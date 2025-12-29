import { useState, useEffect } from 'react';

function LockerInfoModal({ locker, onClose }) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch available users when modal opens
    if (locker?.status === 'available') {
      fetchUsers();
    }
  }, [locker]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users/');
      const result = await res.json();
      if (result.success) {
        setUsers(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!locker) return null;

  const handleAssignUser = async () => {
    if (!selectedUserId) {
      setMessage('Please select a user');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/lockers/assign-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lockerId: locker._id,
          userId: selectedUserId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('User assigned to locker successfully!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage(result.message || 'Failed to assign user');
      }
    } catch (err) {
      console.error('Error assigning user:', err);
      setMessage('Error assigning user: ' + err.message);
    }
    setLoading(false);
  };

  const handleRelease = async () => {
    console.log('Releasing locker with id:', locker._id);
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/lockers/release', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lockerId: locker._id }),
      });
      const result = await response.json();
      console.log('Release response:', result);
      if (result.success) {
        setMessage('Locker released successfully!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage('Failed to release locker: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error releasing locker:', err);
      setMessage('Error releasing locker: ' + err.message);
    }
    setLoading(false);
  };

  const handleGrantAccess = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/lockers/access', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lockerId: locker._id }),
      });
      const result = await response.json();

      if (result.success) {
        setMessage('Access granted! Locker unlocked.');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage('Failed to grant access');
      }
    } catch (err) {
      console.error('Error granting access:', err);
      setMessage('Error granting access: ' + err.message);
    }
    setLoading(false);
  };

  const isAvailable = locker.status === 'available';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Locker {locker.locker_number} Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-md text-sm ${
              message.includes('success') || message.includes('successfully')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <span className="font-semibold">Status:</span>
            <span
              className={`ml-2 px-2 py-1 rounded text-sm ${
                isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {isAvailable ? 'Available' : 'Occupied'}
            </span>
          </div>

          {!isAvailable && locker.user && (
            <div>
              <span className="font-semibold">Assigned to:</span>
              <div className="mt-1 p-2 bg-blue-50 rounded">
                <p className="text-sm font-medium text-blue-900">{locker.user.name}</p>
                <p className="text-xs text-blue-700">{locker.user.email}</p>
              </div>
            </div>
          )}

          {locker.issued_at && (
            <div>
              <span className="font-semibold">Issued at:</span>
              <span className="ml-2 text-sm">{new Date(locker.issued_at).toLocaleString()}</span>
            </div>
          )}

          {locker.expired_at && (
            <div>
              <span className="font-semibold">Expires at:</span>
              <span className="ml-2 text-sm">{new Date(locker.expired_at).toLocaleString()}</span>
            </div>
          )}

          {locker.accessed_at && (
            <div>
              <span className="font-semibold">Last Opened:</span>
              <span className="ml-2 text-sm">{new Date(locker.accessed_at).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Assign User Section for Available Lockers */}
        {isAvailable && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="block text-sm font-semibold mb-2">Assign User to This Locker</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm mb-3"
            >
              <option value="">Select a user...</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <button
              onClick={handleAssignUser}
              disabled={loading || !selectedUserId}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {loading ? 'Assigning...' : 'Assign User & Give Access'}
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-2">
          {!isAvailable && (
            <>
              <button
                onClick={handleGrantAccess}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm"
              >
                {loading ? 'Processing...' : 'Grant Access'}
              </button>
              <button
                onClick={handleRelease}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-sm"
              >
                {loading ? 'Releasing...' : 'End Session'}
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default LockerInfoModal;
