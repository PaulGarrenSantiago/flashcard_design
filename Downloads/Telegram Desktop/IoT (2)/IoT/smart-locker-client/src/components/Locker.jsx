import { useEffect, useState } from "react";
import lockerImg from "../assets/metal_locker.png";
import LockerInfoModal from './LockerInfoModal';

function Locker({ lockerId }) {
  const [lockers, setLockers] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, occupied: 0 });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchLockers();
    fetchStats();
    fetchRecentLogs();
  }, [lockerId]);

  const fetchLockers = async () => {
    try {
      const res = await fetch(`/api/lockers/`);
      const result = await res.json();
      if (result.success) {
        setLockers(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/lockers/stats`);
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecentLogs = async () => {
    try {
      const res = await fetch(`/api/logs/recent`);
      const result = await res.json();
      if (result.success) {
        // Get only the 4 most recent logs
        setRecentLogs(result.data.slice(0, 4));
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleLockerClick = async (lockerId) => {
    try {
      const res = await fetch(`/api/lockers/${lockerId}`);
      const result = await res.json();
      if (result.success) {
        console.log('selectedLocker data:', result.data);
        setSelectedLocker(result.data);
        setModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  if (loading) return <div className="text-center py-12">Loading dashboard...</div>;

  return (
    <>
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Smart Locker Dashboard</h1>
        <p className="text-gray-600">Manage and monitor locker system in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-semibold mb-1">Total Lockers</p>
              <p className="text-4xl font-bold">{stats.total}</p>
            </div>
            <div className="text-5xl opacity-20">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-semibold mb-1">Available</p>
              <p className="text-4xl font-bold">{stats.available}</p>
            </div>
            <div className="text-5xl opacity-20">✓</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-semibold mb-1">Occupied</p>
              <p className="text-4xl font-bold">{stats.occupied}</p>
            </div>
            <div className="text-5xl opacity-20">🔒</div>
          </div>
        </div>
      </div>

      {/* Lockers Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Lockers</h2>
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {lockers.length} total
          </span>
        </div>

        {!lockers || lockers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No lockers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lockers.map(locker => {
              const isAvailable = locker.status === "available";

              return (
                <div
                  key={locker._id}
                  onClick={() => handleLockerClick(locker._id)}
                  className={`relative w-full h-72 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer border-4 ${
                    isAvailable ? "border-green-500" : "border-red-500"
                  }`}
                >
                  {/* Background image */}
                  <img
                    src={lockerImg}
                    alt="Locker"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Locker number */}
                  <div className="absolute top-3 left-3 bg-white text-teal-600 font-semibold px-3 py-1 rounded-md text-sm z-10 shadow-md">
                    {locker.locker_number}
                  </div>

                  {/* Status badge */}
                  <div
                    className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full text-sm font-semibold text-white z-10 shadow-md ${
                      isAvailable ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {isAvailable ? "Available" : "Occupied"}
                  </div>

                  {/* Click hint */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm opacity-0 hover:opacity-100 transition-opacity z-20">
                    Click to manage
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>

        {recentLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No access logs yet.
          </div>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status.toUpperCase()}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Locker #{log.locker_number}
                      </p>
                      <p className="text-sm text-gray-600">
                        {log.user?.name || 'Unknown User'} ({log.card_uid})
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {log.timestamp ? new Date(log.timestamp).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-center">
          <a href="/history" className="text-blue-500 hover:text-blue-700 font-medium text-sm">
            View all activity →
          </a>
        </div>
      </div>

      {modalOpen && <LockerInfoModal locker={selectedLocker} onClose={() => setModalOpen(false)} />}
    </>
  );
}

export default Locker;
