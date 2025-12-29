import { useState, useEffect } from 'react';

function Counter() {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/lockers/')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          const lockers = result.data;
          const total = lockers.length;
          const available = lockers.filter(l => l.status === 'available').length;
          const occupied = lockers.filter(l => l.status === 'occupied').length;

          setStats({ total, available, occupied });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading stats...</div>;

  return (
    <div className="flex flex-col space-y-4 w-64">
      <div className="bg-blue-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-blue-800">Total Lockers</h3>
        <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
      </div>

      <div className="bg-green-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-green-800">Available Lockers</h3>
        <p className="text-2xl font-bold text-green-600">{stats.available}</p>
      </div>

      <div className="bg-red-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-red-800">Occupied Lockers</h3>
        <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
      </div>
    </div>
  );
}

export default Counter;
