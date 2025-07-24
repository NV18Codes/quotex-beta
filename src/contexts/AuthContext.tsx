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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateBalance: (amount: number) => void;
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

const jonathanUser: User = {
  id: '2',
  name: 'Jonathan George Jeremiah',
  email: 'johathan23j@gmail.com', // Updated to match login credentials
  demoBalance: 10000,
  liveBalance: 21000,
  totalTrades: 0,
  winRate: 0,
  totalPnL: 0,
  tradeHistory: []
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('qxTrader_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }

    const existingTrades = localStorage.getItem('userTrades');
    if (!existingTrades) {
      // No default trades for Jonathan (0 trades)
      localStorage.setItem('userTrades', JSON.stringify([]));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    let authenticatedUser: User | null = null;

    if (email === 'johathan23j@gmail.com' && password === 'godfather23JGJJJ$!') {
      authenticatedUser = jonathanUser;
    }

    if (authenticatedUser) {
      localStorage.setItem('qxTrader_user', JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      setIsAuthenticated(true);

      // Always reset userTrades to an empty array for a fresh start
      localStorage.setItem('userTrades', JSON.stringify([]));

      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('qxTrader_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        liveBalance: user.liveBalance + amount
      };
      setUser(updatedUser);
      localStorage.setItem('qxTrader_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    updateBalance
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
  let baseTrades: any[] = [];

  const savedTrades = localStorage.getItem('userTrades');
  if (savedTrades) {
    try {
      baseTrades = JSON.parse(savedTrades).map((trade: any) => ({
        ...trade,
        timestamp: new Date(trade.timestamp),
        status: trade.status || 'completed'
      }));
    } catch (error) {
      console.error('Error parsing saved trades:', error);
      baseTrades = [];
    }
  } else if (userTradeHistory && userTradeHistory.length > 0) {
    baseTrades = userTradeHistory.map(trade => ({
      ...trade,
      status: 'completed'
    }));
  }

  // Only use actual trades; if none, return empty stats
  const completedTrades = baseTrades.filter(trade => trade.status === 'completed');
  const totalTrades = completedTrades.length;
  const winningTrades = completedTrades.filter(trade => trade.result === 'win').length;
  const totalProfit = completedTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  return {
    trades: baseTrades,
    stats: {
      totalTrades,
      winRate,
      totalProfit,
      winningTrades
    }
  };
}
