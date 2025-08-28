import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import DynamicFavicon from './components/DynamicFavicon';
import Index from './pages/Index';
import BinaryOptions from './pages/BinaryOptions';
import Markets from './pages/Markets';
import Education from './pages/Education';
import About from './pages/About';
import UserSettings from './pages/UserSettings';
import RecentTrades from './pages/RecentTrades';
import NotFound from './pages/NotFound';
import Deposit from './pages/Deposit';
import Withdrawal from './pages/Withdrawal';
import Transactions from './pages/Transactions';

import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <DynamicFavicon />
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/binary-options" element={<BinaryOptions />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/education" element={<Education />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/recent-trades" element={<RecentTrades />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdrawal" element={<Withdrawal />} />
          <Route path="/transactions" element={<Transactions />} />
  
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
