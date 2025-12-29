import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Locker from './components/Locker';
import History from './components/History';
import Avail from './components/Avail';
import Card from './components/Card';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Locker />} />
            <Route path="/history" element={<History />} />
            <Route path="/avail" element={<Avail />} />
            <Route path="/cards" element={<Card />} />
            <Route path="/" element={<Locker />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
