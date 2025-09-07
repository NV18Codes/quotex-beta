import { Bell, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TopBar = () => {
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 flex items-center justify-between px-8 bg-[#20243a] border-b border-[#23273a] shadow-strong">
      {/* Left: Logo and Platform Name */}
      <div className="flex items-center gap-4 min-w-0">
        <img src="/favicon.ico" alt="Logo" className="w-8 h-8 rounded" />
        <span className="text-lg font-bold tracking-wide text-white whitespace-nowrap">TradePlatform</span>
        <span className="text-xs text-gray-400 ml-2 truncate max-w-[120px]">MODERN TRADING PLATFORM</span>
      </div>
      {/* Center: Bonus Banner */}
      <div className="flex-1 flex justify-center min-w-0">
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2 rounded-full flex items-center gap-2 font-semibold shadow-soft max-w-xs md:max-w-md lg:max-w-lg overflow-hidden">
          <span className="inline-block bg-white/20 rounded-full px-2 py-0.5 mr-2 truncate max-w-[180px]">
            <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Get a 30% bonus on your first deposit
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">30%</span>
        </div>
      </div>
      {/* Right: Account, Balance, Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#23273a] px-4 py-2 rounded-lg">
          <span className="uppercase text-xs text-yellow-400 font-bold">Demo Account</span>
          <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
        </div>
        <div className="flex items-center gap-2 bg-[#23273a] px-4 py-2 rounded-lg">
          <span className="text-white font-bold text-lg">{user ? formatCurrency(user.demoBalance) : '$1,000.00'}</span>
        </div>
        <div className="flex items-center gap-2 bg-[#23273a] px-4 py-2 rounded-lg">
          <span className="text-white font-bold text-lg">{user ? formatCurrency(user.liveBalance) : '$2,500.00'}</span>
        </div>
        <button className="bg-green text-white px-5 py-2 rounded-lg font-bold shadow-soft hover:bg-green/90">+ Deposit</button>
        <button className="bg-[#353a4d] text-white px-5 py-2 rounded-lg font-bold shadow-soft hover:bg-[#23273a]">Withdrawal</button>
        <button className="bg-[#23273a] text-gray-300 p-2 rounded-full hover:text-white"><Bell className="w-5 h-5" /></button>
        <button className="bg-[#23273a] text-gray-300 p-2 rounded-full hover:text-white"><Settings className="w-5 h-5" /></button>
      </div>
    </header>
  );
};

export default TopBar; 