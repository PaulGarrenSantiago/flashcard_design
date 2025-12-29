import { Link, useLocation } from 'react-router-dom';
import lockerLogo from '../assets/lockerLogo.svg';

function Sidebar() {
  const location = useLocation();

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout clicked');
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <img src={lockerLogo} alt="Locker Logo" className="h-8 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className={`block px-4 py-2 rounded ${
                location.pathname === '/dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              className={`block px-4 py-2 rounded ${
                location.pathname === '/history' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              History
            </Link>
          </li>
          <li>
            <Link
              to="/avail"
              className={`block px-4 py-2 rounded ${
                location.pathname === '/avail' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Manage Users
            </Link>
          </li>
          <li>
            <Link
              to="/cards"
              className={`block px-4 py-2 rounded ${
                location.pathname === '/cards' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Manage Cards
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 rounded hover:bg-gray-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;