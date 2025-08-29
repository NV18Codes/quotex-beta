import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Target,
  Timer,
  Zap,
  CheckCircle, 
  XCircle,
  AlertCircle,
  Filter
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  duration: number;
  result?: 'win' | 'loss';
  profit?: number;
  timestamp: Date;
  status: 'pending' | 'completed';
  timeLeft?: number;
  completed?: boolean; // Added for completion tracking
}

const TradingPanel = () => {
  const { user, updateBalance, addTrade, updateTrade, getTrades } = useAuth();
  const { toast } = useToast();
  const [activeTrades, setActiveTrades] = useState<Trade[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('EUR/USD');
  const [tradeAmount, setTradeAmount] = useState(100);
  const [tradeDuration, setTradeDuration] = useState(60);
  const [isTrading, setIsTrading] = useState(false);
  const [tradeFilter, setTradeFilter] = useState<'all' | 'buy' | 'sell' | 'pending' | 'completed'>('all');

  // Show loading state if user is not available
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading trading panel...</div>
      </div>
    );
  }

  const symbols = [
    { value: 'EUR/USD', label: 'EUR/USD', name: 'Euro / US Dollar' },
    { value: 'GBP/USD', label: 'GBP/USD', name: 'British Pound / US Dollar' },
    { value: 'USD/JPY', label: 'USD/JPY', name: 'US Dollar / Japanese Yen' },
    { value: 'AUD/USD', label: 'AUD/USD', name: 'Australian Dollar / US Dollar' },
    { value: 'USD/CAD', label: 'USD/CAD', name: 'US Dollar / Canadian Dollar' },
    { value: 'EUR/GBP', label: 'EUR/GBP', name: 'Euro / British Pound' },
    { value: 'USD/CHF', label: 'USD/CHF', name: 'US Dollar / Swiss Franc' },
    { value: 'NZD/USD', label: 'NZD/USD', name: 'New Zealand Dollar / US Dollar' },
    { value: 'BTC/USD', label: 'BTC/USD', name: 'Bitcoin / US Dollar' },
    { value: 'ETH/USD', label: 'ETH/USD', name: 'Ethereum / US Dollar' },
    { value: 'XAU/USD', label: 'XAU/USD', name: 'Gold / US Dollar' },
    { value: 'XAG/USD', label: 'XAG/USD', name: 'Silver / US Dollar' }
  ];

  const durations = [
    { value: 30, label: '30 Seconds' },
    { value: 60, label: '1 Minute' },
    { value: 120, label: '2 Minutes' },
    { value: 300, label: '5 Minutes' },
    { value: 600, label: '10 Minutes' }
  ];

  // Load trades from centralized state
  useEffect(() => {
    const trades = getTrades();
    setActiveTrades(trades);
  }, [getTrades]);

  // Subscribe to trade updates
  useEffect(() => {
    const interval = setInterval(() => {
      const trades = getTrades();
      setActiveTrades(trades);
    }, 1000); // Check for updates every second
    
    return () => clearInterval(interval);
  }, [getTrades]);

  const handleTrade = (type: 'buy' | 'sell') => {
    if (!user) return;

    const tradeId = `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newTrade: Trade = {
      id: tradeId,
      symbol: selectedSymbol,
      type,
      amount: tradeAmount,
      duration: tradeDuration,
      timestamp: new Date(),
      status: 'pending',
      timeLeft: tradeDuration,
      completed: false // Initialize completed to false
    };

    console.log(`Creating new trade: ${tradeId} with duration: ${tradeDuration}s`);

    // Add new trade to the beginning of the existing trade history
    addTrade(newTrade);
    setIsTrading(true);

    // The countdown mechanism will handle trade completion automatically
    // No need for setTimeout - this prevents conflicts
  };

  // Update countdown for pending trades - DIRECTLY UPDATE CENTRALIZED STATE
  useEffect(() => {
    const interval = setInterval(() => {
      // Get current trades from centralized state
      const currentTrades = getTrades();
      let hasChanges = false;
      let hasCompletedTrades = false;
      
      const updatedTrades = currentTrades.map(trade => {
        if (trade.status === 'pending' && trade.timeLeft !== undefined && trade.timeLeft > 0) {
          const newTimeLeft = Math.max(0, trade.timeLeft - 1);
          
          // If countdown reaches 0, complete the trade immediately
          if (newTimeLeft === 0) {
            console.log(`Trade ${trade.id}: Countdown completed, finishing trade`);
            hasChanges = true;
            hasCompletedTrades = true;
            
            // Only complete if trade hasn't been completed yet
            if (!trade.completed) {
              const profit = trade.amount * (0.7 + Math.random() * 0.6); // Always positive profit
              
              // Update balance for completed trade
              if (updateBalance) {
                updateBalance(profit, 'trade');
              }
              
              // Update the trade in centralized state
              const completedTrade = { 
                ...trade, 
                status: 'completed',
                result: 'win',
                profit, 
                timeLeft: 0,
                completed: true
              };
              
              // Update centralized state immediately
              updateTrade(trade.id, completedTrade);
              
              return completedTrade;
            } else {
              // Trade already completed, just ensure status is correct
              return { 
                ...trade, 
                status: 'completed',
                timeLeft: 0
              };
            }
          }
          
          // Update countdown
          hasChanges = true;
          const updatedTrade = { ...trade, timeLeft: newTimeLeft };
          
          // Update centralized state immediately
          updateTrade(trade.id, updatedTrade);
          
          return updatedTrade;
        }
        return trade;
      });
      
      // Update local state to reflect changes
      if (hasChanges) {
        setActiveTrades(updatedTrades);
      }
      
      // Reset trading state if any trades completed
      if (hasCompletedTrades) {
        setIsTrading(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [updateBalance, updateTrade, getTrades]);

  // Single safety mechanism for stuck trades (runs every 3 seconds) - DIRECT UPDATE
  useEffect(() => {
    const safetyInterval = setInterval(() => {
      // Get current trades from centralized state
      const currentTrades = getTrades();
      let hasChanges = false;
      
      const updatedTrades = currentTrades.map(trade => {
        // Only complete trades that are genuinely stuck (no profit/result yet)
        if (trade.status === 'pending' && !trade.completed) {
          const tradeAge = Date.now() - new Date(trade.timestamp).getTime();
          const maxDuration = (trade.duration + 3) * 1000; // Reduced buffer to 3 seconds
          
          if (tradeAge > maxDuration) {
            console.log(`Trade ${trade.id}: Safety mechanism completing stuck trade`);
            hasChanges = true;
            const profit = trade.amount * (0.7 + Math.random() * 0.6);
            
            if (updateBalance) {
              updateBalance(profit, 'trade');
            }
            
            // Update the trade in centralized state
            const completedTrade = { 
              ...trade, 
              status: 'completed',
              result: 'win',
              profit, 
              timeLeft: 0,
              completed: true
            };
            
            // Update centralized state immediately
            updateTrade(trade.id, completedTrade);
            
            return completedTrade;
          }
        }
        return trade;
      });
      
      // Update local state to reflect changes
      if (hasChanges) {
        setActiveTrades(updatedTrades);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(safetyInterval);
  }, [updateBalance, updateTrade, getTrades]);

  // Clean up any trades with invalid timeLeft values
  useEffect(() => {
    setActiveTrades(prev =>
      prev.map(trade =>
        trade.status === 'pending' && typeof trade.timeLeft === 'number' && trade.timeLeft < 0
          ? { ...trade, timeLeft: 0 }
          : trade
      )
    );
  }, [activeTrades]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSelectedSymbolName = () => {
    return symbols.find(s => s.value === selectedSymbol)?.name || selectedSymbol;
  };

  // Memoized countdown display to prevent UI glitches
  const CountdownDisplay = useCallback(({ trade }: { trade: Trade }) => {
    // Always show WIN if timeLeft is 0 or less, or if status is completed
    if (
      trade.status === 'completed' ||
      (trade.timeLeft !== undefined && trade.timeLeft <= 0)
    ) {
      return (
        <div className="flex items-center space-x-2 text-green-400 font-bold text-lg">
          <span>WIN</span>
        </div>
      );
    }
    if (trade.status !== 'pending' || trade.timeLeft === undefined) {
      return null;
    }
    const progressValue = trade.duration ? ((trade.timeLeft / trade.duration) * 100) : 0;
    const displayText = 'Processing...';
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Time Remaining:</span>
          <span className="text-yellow-400 font-mono">
            {formatTime(trade.timeLeft)}
          </span>
        </div>
        <Progress 
          value={progressValue} 
          className="h-2"
        />
        <div className="flex items-center space-x-2 text-yellow-400">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-sm">{displayText}</span>
        </div>
      </div>
    );
  }, []);

  const filteredTrades = useMemo(() => {
    return activeTrades.filter(trade => {
      switch (tradeFilter) {
        case 'buy':
          return trade.type === 'buy';
        case 'sell':
          return trade.type === 'sell';
        case 'pending':
          return trade.status === 'pending';
        case 'completed':
          return trade.status === 'completed';
        default:
          return true;
      }
    });
  }, [activeTrades, tradeFilter]);

  return (
    <div className="space-y-6">
      {/* Account Balance */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Account Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Demo Account</div>
              <div className="text-lg font-semibold text-white">
                ${(user?.demoBalance || 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Live Account</div>
              <div className="text-lg font-semibold text-green-400">
                ${(user?.liveBalance || 0).toLocaleString('en-US')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Place Trade */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Place Trade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Symbol Selection */}
          <div>
            <Label htmlFor="symbol" className="text-gray-300">Trading Symbol</Label>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {symbols.map((symbol) => (
                  <SelectItem key={symbol.value} value={symbol.value} className="text-white hover:bg-gray-600">
                    {symbol.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-400 mt-1">{getSelectedSymbolName()}</div>
          </div>

          {/* Investment Amount */}
          <div>
            <Label htmlFor="amount" className="text-gray-300">Investment Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(Number(e.target.value))}
              min="10"
              max="10000"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {/* Duration Selection */}
          <div>
            <Label htmlFor="duration" className="text-gray-300">Trade Duration</Label>
            <Select value={tradeDuration.toString()} onValueChange={(value) => setTradeDuration(Number(value))}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {durations.map((duration) => (
                  <SelectItem key={duration.value} value={duration.value.toString()} className="text-white hover:bg-gray-600">
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>



          {/* Trade Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleTrade('buy')}
              disabled={isTrading}
              className="bg-green-600 text-white hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              BUY
            </Button>
            <Button
              onClick={() => handleTrade('sell')}
              disabled={isTrading}
              className="bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed"
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              SELL
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trade History */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Trade History
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={tradeFilter}
                onChange={(e) => setTradeFilter(e.target.value as 'all' | 'buy' | 'sell' | 'pending' | 'completed')}
                className="bg-gray-700 border-gray-600 text-white text-sm rounded px-2 py-1"
              >
                <option value="all">All Trades</option>
                <option value="buy">Buy Trades</option>
                <option value="sell">Sell Trades</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTrades.length > 0 ? (
              filteredTrades.slice(0, 10).map((trade) => (
                <div key={trade.id} className="p-4 border border-gray-600 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="font-semibold text-white">{trade.symbol}</div>
                      <Badge className={trade.type === 'buy' ? 'bg-green-600' : 'bg-red-600'}>
                        {trade.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400">
                      ${trade.amount}
                    </div>
                  </div>

                  {trade.status === 'pending' ? (
                    <CountdownDisplay trade={trade} />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center space-x-2 ${
                        trade.result === 'win' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trade.result === 'win' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <span className="font-semibold">
                          {trade.result?.toUpperCase() || 'COMPLETED'}
                        </span>
                      </div>
                      <div className={`font-semibold ${
                        trade.profit && trade.profit >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ${trade.profit?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">No trades yet</div>
                <p className="text-gray-500 text-sm">Start trading to see your history here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Trading Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Total Trades</div>
              <div className="text-lg font-semibold text-white">
                {activeTrades.length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Win Rate</div>
              <div className="text-lg font-semibold text-green-400">
                {activeTrades.filter(t => t.status === 'completed' && t.result === 'win').length > 0 
                  ? Math.round((activeTrades.filter(t => t.status === 'completed' && t.result === 'win').length / 
                     activeTrades.filter(t => t.status === 'completed').length) * 100)
                  : 0}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Total P&L</div>
              <div className="text-lg font-semibold text-green-400">
                ${activeTrades
                  .filter(t => t.status === 'completed' && t.profit)
                  .reduce((sum, trade) => sum + (trade.profit || 0), 0)
                  .toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Active Trades</div>
              <div className="text-lg font-semibold text-blue-400">
                {activeTrades.filter(t => t.status === 'pending').length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

           </div>
  );
};

export default TradingPanel;