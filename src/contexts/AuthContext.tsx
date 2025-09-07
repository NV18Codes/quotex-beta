import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  demoBalance: number;
  liveBalance: number;
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  tradeHistory: Trade[];
  accountType?: 'demo' | 'live';
}

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  result: 'win' | 'loss';
  profit: number;
  timestamp: Date;
  duration: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (amount: number, type?: 'deposit' | 'trade') => void;
  setUserFromLocalStorage: () => void;
  saveTradesToStorage: (trades: any[]) => void;
  loadTradesFromStorage: () => any[];
  addTrade: (trade: any) => void;
  updateTrade: (tradeId: string, updates: any) => void;
  getTrades: () => any[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Two default users
// Remove Samuel user definition
// const samuelUser: User = {
//   id: '1',
//   name: 'Samuel Joseph',
//   email: 'samuelkjoseph2020@gmail.com',
//   demoBalance: 111111.45,
//   liveBalance: 145897,
//   totalTrades: 11893,
//   winRate: 95,
//   totalPnL: 349000,
//   tradeHistory: generateTradeHistory()
// };

const justinUser: User = {
  id: '2',
  name: 'Justin Raju Arokiaswamy',
  email: 'justin@thealphaandomega.org',
  demoBalance: 1000,
  liveBalance: 2500,
  totalTrades: 0,
  winRate: 0,
  totalPnL: 0,
  tradeHistory: [],
  accountType: 'live'
};



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trades, setTrades] = useState<any[]>([]);

  // Load trades from localStorage on mount
  useEffect(() => {
    const savedTrades = loadTradesFromStorage();
    setTrades(savedTrades);
  }, []);

  // Persist trades to localStorage whenever they change
  useEffect(() => {
    if (trades.length > 0) {
      saveTradesToStorage(trades);
    }
  }, [trades]);

  useEffect(() => {
    const savedUser = localStorage.getItem('qxTrader_user');
    if (!savedUser) {
      // Initialize demo-ready user
      localStorage.setItem('qxTrader_user', JSON.stringify(justinUser));
      setUser(justinUser);
      setIsAuthenticated(false);
    } else {
      const userData = JSON.parse(savedUser);
      
      // IMPORTANT: Preserve accumulated profits - never reset below base unless genuinely corrupted
      // Only reset if the balance is completely invalid (negative or undefined)
      if (userData.liveBalance === undefined || userData.liveBalance === null || userData.liveBalance < 0) {
        console.log('Invalid balance detected, resetting to base $2500');
        userData.liveBalance = 2500;
      } else if (userData.liveBalance >= 2500) {
        // Balance is valid and has accumulated profits - preserve them completely
        console.log(`Preserving accumulated balance: $${userData.liveBalance} (Base: $2500 + Profits: $${userData.liveBalance - 2500})`);
      } else if (userData.liveBalance < 2500 && userData.liveBalance > 0) {
        // Balance is below base but positive - this might be from a loss, preserve it
        console.log(`Preserving balance below base: $${userData.liveBalance} (Base: $2500, Loss: $${2500 - userData.liveBalance})`);
      }
      // If balance is exactly 0, it might be a new user or reset case
      
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('qxTrader_user', JSON.stringify(user));
    }
  }, [user]);

  // REMOVED: The useEffect that was always resetting liveBalance to 1200
  // This was overriding accumulated trade profits

  const login = async (email: string, password: string): Promise<boolean> => {
    let authenticatedUser: User | null = null;

    if (email === 'justin@thealphaandomega.org' && password === 'Galvin66') {
      // Check if user already exists in localStorage
      const savedUser = localStorage.getItem('qxTrader_user');
      console.log('Login: Checking localStorage for existing user data...');
      
      if (savedUser) {
        authenticatedUser = JSON.parse(savedUser);
        console.log(`Login: Found existing user data in localStorage`);
        console.log(`Login: User balance before login: $${authenticatedUser.liveBalance}`);
        console.log(`Login: User demo balance: $${authenticatedUser.demoBalance}`);
        
        // CRITICAL: Preserve accumulated profits from trades - never reset liveBalance
        console.log(`Login: Preserving existing balance: $${authenticatedUser.liveBalance}`);
        
        // Double-check balance preservation
        if (authenticatedUser.liveBalance >= 2500) {
          const accumulatedProfits = authenticatedUser.liveBalance - 2500;
          console.log(`Login: Balance preserved - Base: $2500 + Accumulated Profits: $${accumulatedProfits} = Total: $${authenticatedUser.liveBalance}`);
        } else if (authenticatedUser.liveBalance > 0) {
          console.log(`Login: Balance preserved - Current: $${authenticatedUser.liveBalance} (may be below base due to losses)`);
        }
        
        // The base balance logic is handled in updateBalance function
      } else {
        console.log('Login: No existing user data found, creating new user');
        authenticatedUser = justinUser;
        console.log('Login: New user created with base balance: $1200');
        // Only set localStorage if new user
        localStorage.setItem('qxTrader_user', JSON.stringify(authenticatedUser));
      }
    }

    if (authenticatedUser) {
      console.log(`Login: Setting user with final balance: $${authenticatedUser.liveBalance}`);
      setUser(authenticatedUser);
      setIsAuthenticated(true);

      // Trade history is automatically preserved in localStorage
      // No need to clear or modify it during login

      return true;
    }

    return false;
  };

  const logout = () => {
    // CRITICAL: Preserve all user data including balance and trade history
    // DO NOT remove user data from localStorage - just mark as not authenticated
    
    if (user) {
      console.log(`Logout: Preserving balance: $${user.liveBalance} (Base: $2500 + Profits: $${Math.max(0, user.liveBalance - 2500)})`);
      console.log('Logout: All user data preserved in localStorage for next login');
      
      // Save the current user state before logging out
      // This ensures the balance and all data is preserved
      localStorage.setItem('qxTrader_user', JSON.stringify(user));
    }
    
    // Don't clear trade history - preserve it for when user logs back in
    // localStorage.removeItem('userTrades'); // REMOVED - preserve trade history
    
    // DON'T remove user data - just clear the session state
    // localStorage.removeItem('qxTrader_user'); // REMOVED - preserve user data
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateBalance = (amount: number, type: 'deposit' | 'trade' = 'deposit') => {
    if (user) {
      let updatedUser;
      
      if (type === 'deposit') {
        // For deposits, only update demo balance, preserve live balance with accumulated profits
        updatedUser = {
          ...user,
          demoBalance: user.demoBalance + amount,
          liveBalance: user.liveBalance // Preserve current live balance with accumulated profits
        };
      } else if (type === 'trade') {
        // For trades, update the live balance with profits/losses
        // IMPORTANT: Start from base live balance of 2500 and add accumulated profits
        // This ensures the base $2500 is never lost, only profits accumulate
        const currentLiveBalance = user.liveBalance || 2500;
        const baseLiveBalance = 2500;
        
        // Calculate how much profit we already have accumulated
        const accumulatedProfits = Math.max(0, currentLiveBalance - baseLiveBalance);
        
        // Add new profit/loss to accumulated profits
        const newAccumulatedProfits = accumulatedProfits + amount;
        
        // New live balance = base $2500 + all accumulated profits
        // Use Math.max to ensure balance never goes below $2500
        const newLiveBalance = Math.max(baseLiveBalance, baseLiveBalance + newAccumulatedProfits);
        
        console.log(`Balance Update: Current: $${currentLiveBalance}, Base: $${baseLiveBalance}, Accumulated: $${accumulatedProfits}, New Profit: $${amount}, New Total: $${newLiveBalance}`);
        
        updatedUser = {
          ...user,
          liveBalance: newLiveBalance
        };
      }
      
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('qxTrader_user', JSON.stringify(updatedUser));
      }
    }
  };

  // Add setUserFromLocalStorage
  const setUserFromLocalStorage = () => {
    const savedUser = localStorage.getItem('qxTrader_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  // Trade management functions
  const addTrade = (trade: any) => {
    setTrades(prev => [trade, ...prev]);
  };

  const updateTrade = (tradeId: string, updates: any) => {
    setTrades(prev => 
      prev.map(trade => 
        trade.id === tradeId ? { ...trade, ...updates } : trade
      )
    );
  };

  const getTrades = () => trades;

  // Real-time trade synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      const savedTrades = loadTradesFromStorage();
      // Only update if there are actual changes to avoid infinite loops
      if (JSON.stringify(savedTrades) !== JSON.stringify(trades)) {
        setTrades(savedTrades);
      }
    }, 2000); // Check every 2 seconds for external changes
    
    return () => clearInterval(interval);
  }, [trades]);


  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    updateBalance,
    setUserFromLocalStorage,
    saveTradesToStorage,
    loadTradesFromStorage,
    addTrade,
    updateTrade,
    getTrades
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Unified trade data function
export function getUnifiedTradeData(userTradeHistory?: any[]): {
  trades: any[];
  stats: {
    totalTrades: number;
    winRate: number;
    totalProfit: number;
    winningTrades: number;
  };
} {
  // Load trades from localStorage instead of clearing them
  const savedTrades = localStorage.getItem('userTrades');
  const trades = savedTrades ? JSON.parse(savedTrades) : [];
  
  // Calculate stats from actual trades
  const completedTrades = trades.filter((trade: any) => trade.status === 'completed');
  const totalTrades = completedTrades.length;
  const winningTrades = completedTrades.filter((trade: any) => trade.result === 'win').length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const totalProfit = completedTrades.reduce((sum: number, trade: any) => sum + (trade.profit || 0), 0);
  
  return {
    trades,
    stats: {
      totalTrades,
      winRate: Math.round(winRate),
      totalProfit: Math.round(totalProfit * 100) / 100,
      winningTrades
    }
  };
}

// Function to save trades to localStorage
export function saveTradesToStorage(trades: any[]) {
  // Always save trades, even if empty array, to ensure persistence
  localStorage.setItem('userTrades', JSON.stringify(trades));
}

// Function to load trades from localStorage
export function loadTradesFromStorage(): any[] {
  const savedTrades = localStorage.getItem('userTrades');
  return savedTrades ? JSON.parse(savedTrades) : [];
}
