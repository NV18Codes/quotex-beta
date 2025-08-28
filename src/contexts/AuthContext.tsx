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
  liveBalance: 1104,
  totalTrades: 0,
  winRate: 0,
  totalPnL: 0,
  tradeHistory: [],
  accountType: 'live'
};



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('qxTrader_user');
    if (!savedUser) {
      // Initialize demo-ready user
      localStorage.setItem('qxTrader_user', JSON.stringify(justinUser));
      setUser(justinUser);
      setIsAuthenticated(false);
    } else {
      const userData = JSON.parse(savedUser);
      // Ensure live balance is always $1104
      userData.liveBalance = 1104;
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

  // Ensure live balance stays fixed at $1104
  useEffect(() => {
    if (user && user.liveBalance !== 1104) {
      setUser({ ...user, liveBalance: 1104 });
    }
  }, [user?.id, user?.email, user?.name]);

  const login = async (email: string, password: string): Promise<boolean> => {
    let authenticatedUser: User | null = null;

    if (email === 'justin@thealphaandomega.org' && password === 'Galvin66') {
      // Check if user already exists in localStorage
      const savedUser = localStorage.getItem('qxTrader_user');
      if (savedUser) {
        authenticatedUser = JSON.parse(savedUser);
        // Ensure live balance is always $1104 regardless of saved state
        authenticatedUser.liveBalance = 1104;
      } else {
        authenticatedUser = justinUser;
        // Only set localStorage if new user
        localStorage.setItem('qxTrader_user', JSON.stringify(authenticatedUser));
      }
    }

    if (authenticatedUser) {
      setUser(authenticatedUser);
      setIsAuthenticated(true);

      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('qxTrader_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateBalance = (amount: number, type: 'deposit' | 'trade' = 'deposit') => {
    if (user) {
      let updatedUser;
      
      if (type === 'deposit') {
        // For deposits, only update demo balance, keep live balance fixed at $1104
        updatedUser = {
          ...user,
          demoBalance: user.demoBalance + amount,
          liveBalance: 1104 // Always keep live balance fixed
        };
      } else if (type === 'trade') {
        // For trades, update the live balance with profits/losses
        // Start from base live balance of 1104 and add accumulated profits
        const currentLiveBalance = user.liveBalance || 1104;
        const baseLiveBalance = 1104;
        const accumulatedProfits = currentLiveBalance - baseLiveBalance;
        const newAccumulatedProfits = accumulatedProfits + amount;
        const newLiveBalance = baseLiveBalance + newAccumulatedProfits;
        
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



  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    updateBalance,
    setUserFromLocalStorage,
    saveTradesToStorage,
    loadTradesFromStorage
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
  localStorage.setItem('userTrades', JSON.stringify(trades));
}

// Function to load trades from localStorage
export function loadTradesFromStorage(): any[] {
  const savedTrades = localStorage.getItem('userTrades');
  return savedTrades ? JSON.parse(savedTrades) : [];
}
