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
<<<<<<< HEAD
  name: 'Justin Raju Arokiaswamy',
  email: 'justin@thealphaandomega.org',
  demoBalance: 1000,
  liveBalance: 2500,
=======
  name: 'Jonathan George Jeremiah',
  email: 'johathan23j@gmail.com', // Updated to match login credentials
  demoBalance: 10000,
  liveBalance: 0, // Set to 0 after crypto transfer
>>>>>>> bf21386edd5c1bd84756245c79c1c3780f313e71
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
<<<<<<< HEAD
      
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
      
=======
      // Ensure live balance is always $0 after crypto transfer
      userData.liveBalance = 0;
>>>>>>> bf21386edd5c1bd84756245c79c1c3780f313e71
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

  // Ensure live balance stays at $0 after crypto transfer
  useEffect(() => {
    if (user && user.liveBalance !== 0) {
      setUser({ ...user, liveBalance: 0 });
    }
  }, [user?.id, user?.email, user?.name]);

  const login = async (email: string, password: string): Promise<boolean> => {
    let authenticatedUser: User | null = null;

    if (email === 'johathan23j@gmail.com' && password === 'godfather23JGJJJ$!') {
      // Check if user already exists in localStorage
      const savedUser = localStorage.getItem('qxTrader_user');
      console.log('Login: Checking localStorage for existing user data...');
      
      if (savedUser) {
        authenticatedUser = JSON.parse(savedUser);
<<<<<<< HEAD
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
=======
        // Ensure live balance is always $0 after crypto transfer regardless of saved state
        authenticatedUser.liveBalance = 0;
      } else {
        authenticatedUser = jonathanUser;
>>>>>>> bf21386edd5c1bd84756245c79c1c3780f313e71
        // Only set localStorage if new user
        localStorage.setItem('qxTrader_user', JSON.stringify(authenticatedUser));
      }
    }

    if (authenticatedUser) {
      console.log(`Login: Setting user with final balance: $${authenticatedUser.liveBalance}`);
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
<<<<<<< HEAD
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
=======
    localStorage.removeItem('qxTrader_user');
>>>>>>> bf21386edd5c1bd84756245c79c1c3780f313e71
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
          liveBalance: 0 // Always keep live balance at 0 after crypto transfer
        };
<<<<<<< HEAD
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
=======
>>>>>>> bf21386edd5c1bd84756245c79c1c3780f313e71
        setUser(updatedUser);
        localStorage.setItem('qxTrader_user', JSON.stringify(updatedUser));
      } else if (type === 'trade') {
        // For trades, update demo balance
      const updatedUser = {
        ...user,
        demoBalance: user.demoBalance + amount,
          liveBalance: 0 // Always keep live balance at 0 after crypto transfer
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
