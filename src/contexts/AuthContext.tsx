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
  // Dubai Region verification fields
  dubaiVerification?: {
    isVerified: boolean;
    verificationDate?: Date;
    fullName?: string;
    country?: string;
    address?: string;
    whyQuotex?: string;
    governmentId?: string;
    documentsUploaded?: boolean;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    submittedAt?: Date;
  };
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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateBalance: (amount: number, type?: 'deposit' | 'trade') => void;
  setUserFromLocalStorage: () => void;
  // Trade management methods
  addTrade: (trade: any) => void;
  updateTrade: (tradeId: string, updates: any) => void;
  getTrades: () => any[];
  // Dubai verification methods
  submitDubaiVerification: (verificationData: any) => void;
  checkDubaiVerificationRequired: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Jonathan George Jeremiah user account

const jonathanUser: User = {
  id: '2',
  name: 'Jonathan George Jeremiah',
  email: 'johathan23j@gmail.com', // Updated to match login credentials
  demoBalance: 10000,
  liveBalance: 100343,
  totalTrades: 0,
  winRate: 0,
  totalPnL: 0,
  tradeHistory: [],
  accountType: 'live',
  dubaiVerification: {
    isVerified: false,
    verificationStatus: 'pending',
    documentsUploaded: false
  }
};



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('qxTrader_user');
    if (!savedUser) {
      // Initialize demo-ready user
      localStorage.setItem('qxTrader_user', JSON.stringify(jonathanUser));
      setUser(jonathanUser);
      setIsAuthenticated(false);
    } else {
      const userData = JSON.parse(savedUser);
      // Ensure live balance is always $100,343
      userData.liveBalance = 100343;
      setUser(userData);
      setIsAuthenticated(true);
    }

    const existingTrades = localStorage.getItem('userTrades');
    if (!existingTrades) {
      localStorage.setItem('userTrades', JSON.stringify([]));
    }
  }, []);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('qxTrader_user', JSON.stringify(user));
    }
  }, [user]);

  // Ensure live balance stays fixed at $100,343
  useEffect(() => {
    if (user && user.liveBalance !== 100343) {
      setUser({ ...user, liveBalance: 100343 });
    }
  }, [user?.id, user?.email, user?.name]);

  const login = async (email: string, password: string): Promise<boolean> => {
    let authenticatedUser: User | null = null;

    if (email === 'johathan23j@gmail.com' && password === 'godfather23JGJJJ$!') {
      // Check if user already exists in localStorage
      const savedUser = localStorage.getItem('qxTrader_user');
      if (savedUser) {
        authenticatedUser = JSON.parse(savedUser);
        // Ensure live balance is always $100,343 regardless of saved state
        authenticatedUser.liveBalance = 100343;
      } else {
        authenticatedUser = jonathanUser;
        // Only set localStorage if new user
        localStorage.setItem('qxTrader_user', JSON.stringify(authenticatedUser));
      }
    }

    if (authenticatedUser) {
      setUser(authenticatedUser);
      setIsAuthenticated(true);

      // Only set userTrades to an empty array if it does not exist (first login)
      if (!localStorage.getItem('userTrades')) {
        localStorage.setItem('userTrades', JSON.stringify([]));
      }

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
      if (type === 'deposit') {
        // For deposits, only update demo balance, keep live balance fixed at $100,343
        const updatedUser = {
          ...user,
          demoBalance: user.demoBalance + amount,
          liveBalance: 100343 // Always keep live balance fixed
        };
        setUser(updatedUser);
        localStorage.setItem('qxTrader_user', JSON.stringify(updatedUser));
      } else if (type === 'trade') {
        // For trades, update demo balance
      const updatedUser = {
        ...user,
        demoBalance: user.demoBalance + amount,
          liveBalance: 100343 // Always keep live balance fixed
      };
      setUser(updatedUser);
      localStorage.setItem('qxTrader_user', JSON.stringify(updatedUser));
    }
    }
  };

  // Trade management functions
  const addTrade = (trade: any) => {
    const savedTrades = localStorage.getItem('userTrades');
    const trades = savedTrades ? JSON.parse(savedTrades) : [];
    trades.unshift(trade);
    localStorage.setItem('userTrades', JSON.stringify(trades));
  };

  const updateTrade = (tradeId: string, updates: any) => {
    const savedTrades = localStorage.getItem('userTrades');
    const trades = savedTrades ? JSON.parse(savedTrades) : [];
    const updatedTrades = trades.map((trade: any) => 
      trade.id === tradeId ? { ...trade, ...updates } : trade
    );
    localStorage.setItem('userTrades', JSON.stringify(updatedTrades));
  };

  const getTrades = () => {
    const savedTrades = localStorage.getItem('userTrades');
    if (savedTrades) {
      try {
        return JSON.parse(savedTrades).map((trade: any) => ({
          ...trade,
          timestamp: new Date(trade.timestamp),
          timeLeft: trade.timeLeft !== undefined ? trade.timeLeft : 0,
          result: trade.result === 'win' ? 'win' : trade.result === 'loss' ? 'loss' : undefined,
        }));
      } catch (error) {
        console.error('Error parsing saved trades:', error);
        return [];
      }
    }
    return [];
  };

  // Add setUserFromLocalStorage
  const setUserFromLocalStorage = () => {
    const savedUser = localStorage.getItem('qxTrader_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  // Dubai verification methods
  const submitDubaiVerification = (verificationData: any) => {
    if (user) {
      const updatedUser = {
        ...user,
        dubaiVerification: {
          ...user.dubaiVerification,
          ...verificationData,
          submittedAt: new Date(),
          verificationStatus: 'pending' as const,
          documentsUploaded: true
        }
      };
      setUser(updatedUser);
      localStorage.setItem('qxTrader_user', JSON.stringify(updatedUser));
    }
  };

  const checkDubaiVerificationRequired = (): boolean => {
    if (!user) return false;
    
    // Check if user is in Dubai region (you can add more sophisticated logic here)
    const isDubaiRegion = true; // For now, assume all users are in Dubai region
    
    // Check if verification is already completed
    const isAlreadyVerified = user.dubaiVerification?.isVerified;
    
    // Manual verification - no automatic balance threshold
    // Users can manually trigger verification when needed
    return isDubaiRegion && !isAlreadyVerified;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    updateBalance,
    setUserFromLocalStorage,
    addTrade,
    updateTrade,
    getTrades,
    submitDubaiVerification,
    checkDubaiVerificationRequired
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
