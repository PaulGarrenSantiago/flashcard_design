import { useState, useEffect } from 'react';

function History() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use relative URL to work with both localhost and remote servers
    const apiUrl = '/api/logs/recent';
    
    fetch(apiUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(result => {
        if (result.success) {
          setLogs(result.data);
        } else {
          console.error('API returned success: false', result);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch access logs:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">Loading access logs...</div>;

  if (error) return <div className="max-w-6xl mx-auto mt-10 p-6 bg-red-50 rounded-lg shadow-md text-red-600">Error loading access logs: {error}</div>;

  const getStatusColor = (status) => {
    switch(status) {
      case 'granted':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Access Logs</h2>

      {logs.length === 0 ? (
        <p>No access logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Locker</th>
                <th className="px-4 py-2 text-left">Card UID</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-4 py-2 font-semibold">{log.locker_number}</td>
                  <td className="px-4 py-2 font-mono text-sm">{log.card_uid}</td>
                  <td className="px-4 py-2">
                    <div className="text-sm">
                      <div className="font-medium">{log.user?.name || 'Unknown'}</div>
                      <div className="text-gray-500">{log.user?.email || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(log.status)}`}>
                      {getStatusDisplay(log.status)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">{log.reason || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default History;
