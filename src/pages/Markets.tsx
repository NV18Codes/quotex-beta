import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  BarChart3,
  Play,
  Pause,
  RefreshCw,
  Target,
  Timer,
  Zap,
  Activity,
  Filter
} from 'lucide-react';

interface Market {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  category: string;
}

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
}

const Markets = () => {
  const { user, updateBalance, addTrade, updateTrade, getTrades } = useAuth();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [tradeAmount, setTradeAmount] = useState(100);
  const [tradeDuration, setTradeDuration] = useState(60);
  const [isTrading, setIsTrading] = useState(false);
  const [activeTrades, setActiveTrades] = useState<Trade[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tradeFilter, setTradeFilter] = useState('all');

  const categories = [
    { id: 'forex', name: 'Forex', icon: DollarSign },
    { id: 'crypto', name: 'Cryptocurrency', icon: Zap },
    { id: 'commodities', name: 'Commodities', icon: Target },
    { id: 'indices', name: 'Indices', icon: BarChart3 }
  ];

  const durations = [
    { value: 30, label: '30 Seconds' },
    { value: 60, label: '1 Minute' },
    { value: 120, label: '2 Minutes' },
    { value: 300, label: '5 Minutes' },
    { value: 600, label: '10 Minutes' }
  ];

  // Generate mock market data
  useEffect(() => {
    const mockMarkets: Market[] = [
      // Forex
      { symbol: 'EUR/USD', name: 'Euro / US Dollar', currentPrice: 1.0856, change: 0.0023, changePercent: 0.21, high: 1.0872, low: 1.0834, volume: 1250000, category: 'forex' },
      { symbol: 'GBP/USD', name: 'British Pound / US Dollar', currentPrice: 1.2647, change: -0.0018, changePercent: -0.14, high: 1.2665, low: 1.2632, volume: 890000, category: 'forex' },
      { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', currentPrice: 148.23, change: 0.45, changePercent: 0.30, high: 148.45, low: 147.98, volume: 1100000, category: 'forex' },
      { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', currentPrice: 0.6589, change: 0.0012, changePercent: 0.18, high: 0.6598, low: 0.6575, volume: 650000, category: 'forex' },
      { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', currentPrice: 1.3542, change: -0.0021, changePercent: -0.15, high: 1.3561, low: 1.3528, volume: 720000, category: 'forex' },
      { symbol: 'EUR/GBP', name: 'Euro / British Pound', currentPrice: 0.8589, change: 0.0015, changePercent: 0.17, high: 0.8598, low: 0.8575, volume: 450000, category: 'forex' },
      { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', currentPrice: 0.8923, change: -0.0008, changePercent: -0.09, high: 0.8935, low: 0.8912, volume: 380000, category: 'forex' },
      { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', currentPrice: 0.6123, change: 0.0009, changePercent: 0.15, high: 0.6132, low: 0.6115, volume: 320000, category: 'forex' },
      
      // Crypto
      { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', currentPrice: 43250, change: 1250, changePercent: 2.98, high: 43500, low: 42000, volume: 2500000, category: 'crypto' },
      { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', currentPrice: 2650, change: 85, changePercent: 3.31, high: 2675, low: 2580, volume: 1800000, category: 'crypto' },
      { symbol: 'XRP/USD', name: 'Ripple / US Dollar', currentPrice: 0.58, change: 0.02, changePercent: 3.57, high: 0.59, low: 0.56, volume: 950000, category: 'crypto' },
      { symbol: 'ADA/USD', name: 'Cardano / US Dollar', currentPrice: 0.45, change: 0.01, changePercent: 2.27, high: 0.46, low: 0.44, volume: 680000, category: 'crypto' },
      
      // Commodities
      { symbol: 'XAU/USD', name: 'Gold / US Dollar', currentPrice: 2045, change: 12, changePercent: 0.59, high: 2050, low: 2035, volume: 850000, category: 'commodities' },
      { symbol: 'XAG/USD', name: 'Silver / US Dollar', currentPrice: 23.45, change: 0.15, changePercent: 0.64, high: 23.55, low: 23.35, volume: 420000, category: 'commodities' },
      { symbol: 'OIL/USD', name: 'Crude Oil / US Dollar', currentPrice: 78.50, change: -1.20, changePercent: -1.51, high: 79.80, low: 78.20, volume: 680000, category: 'commodities' },
      
      // Indices
      { symbol: 'SPX500', name: 'S&P 500', currentPrice: 4850, change: 25, changePercent: 0.52, high: 4865, low: 4835, volume: 1500000, category: 'indices' },
      { symbol: 'NAS100', name: 'NASDAQ 100', currentPrice: 17250, change: 85, changePercent: 0.49, high: 17280, low: 17220, volume: 1200000, category: 'indices' },
      { symbol: 'DJ30', name: 'Dow Jones 30', currentPrice: 38500, change: 150, changePercent: 0.39, high: 38550, low: 38450, volume: 950000, category: 'indices' }
    ];

    setMarkets(mockMarkets);
  }, []);

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update market prices
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets(prev => prev.map(market => {
        const fluctuation = (Math.random() - 0.5) * 0.002; // Small random fluctuation
        const newPrice = market.currentPrice * (1 + fluctuation);
        const change = newPrice - market.currentPrice;
        const changePercent = (change / market.currentPrice) * 100;
        
        return {
          ...market,
          currentPrice: newPrice,
          change,
          changePercent,
          high: Math.max(market.high, newPrice),
          low: Math.min(market.low, newPrice)
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
    if (!selectedMarket || !user) return;

    const newTrade: Trade = {
      id: `trade_${Date.now()}`,
      symbol: selectedMarket.symbol,
      type,
      amount: tradeAmount,
      duration: tradeDuration,
      timestamp: new Date(),
      status: 'pending'
    };

    // Add new trade to the beginning of the existing trade history
    addTrade(newTrade);
    setIsTrading(true);

    // Simulate trade result after duration - ALWAYS WIN
    setTimeout(() => {
      const profit = tradeAmount * (0.7 + Math.random() * 0.6); // Always positive profit
      
      updateTrade(newTrade.id, { status: 'completed', result: 'win', profit });

      // Update balance
      if (updateBalance) {
        updateBalance(profit, 'trade');
      }
    }, tradeDuration * 1000);
  };

  const formatPrice = (price: number, symbol: string) => {
    if (symbol.includes('USD') && !symbol.includes('BTC') && !symbol.includes('ETH')) {
      return price.toFixed(4);
    }
    return price.toFixed(2);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const formatTimestamp = (timestamp: Date | string) => {
    // Convert string to Date if needed
    const dateObj = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    // Check if the date is valid
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
  };

  const filteredTrades = activeTrades.filter(trade => {
    if (tradeFilter === 'all') return true;
    if (tradeFilter === 'buy') return trade.type === 'buy';
    if (tradeFilter === 'sell') return trade.type === 'sell';
    if (tradeFilter === 'pending') return trade.status === 'pending';
    if (tradeFilter === 'completed') return trade.status === 'completed';
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Markets</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Trade on global financial markets with real-time data and competitive spreads
          </p>
        </div>

        <div className="flex flex-col items-center max-w-4xl mx-auto">
          {/* Markets List */}
          <div className="w-full mb-8">
            <Card className="bg-gray-800 border-gray-700 shadow-xl">
              <CardHeader className="pb-6 text-center">
                <CardTitle className="text-2xl font-bold text-white">Available Markets</CardTitle>
                <p className="text-gray-400">Select from our comprehensive range of trading instruments</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="forex" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-700 p-1 rounded-lg">
                    {categories.map((category) => (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id}
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all duration-200"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {categories.map((category) => (
                    <TabsContent key={category.id} value={category.id} className="mt-8">
                      <div className="space-y-4">
                        {markets
                          .filter(market => market.category === category.id)
                          .map((market) => (
                            <div
                              key={market.symbol}
                              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                                selectedMarket?.symbol === market.symbol
                                  ? 'border-blue-500 bg-blue-900/20 shadow-lg'
                                  : 'border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-650'
                              }`}
                              onClick={() => setSelectedMarket(market)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="font-bold text-xl text-white">{market.symbol}</div>
                                    <Badge className="bg-gray-600 text-gray-300 text-xs">
                                      {category.name}
                                    </Badge>
                                  </div>
                                  <div className="text-gray-400 text-sm">{market.name}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-xl text-white mb-1">
                                    {formatPrice(market.currentPrice, market.symbol)}
                                  </div>
                                  <div className={`text-sm flex items-center justify-end gap-1 font-semibold ${
                                    market.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {market.changePercent >= 0 ? (
                                      <TrendingUp className="h-4 w-4" />
                                    ) : (
                                      <TrendingDown className="h-4 w-4" />
                                    )}
                                    {market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Trading Panel */}
          <div className="w-full space-y-8">
            {/* Selected Market Info */}
            {selectedMarket && (
              <Card className="bg-gray-800 border-gray-700 shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold text-white">Market Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center pb-6 border-b border-gray-600">
                    <div className="text-3xl font-bold text-white mb-2">{selectedMarket.symbol}</div>
                    <div className="text-gray-400">{selectedMarket.name}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-400 mb-2">Current Price</div>
                      <div className="text-xl font-bold text-white">
                        {formatPrice(selectedMarket.currentPrice, selectedMarket.symbol)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-400 mb-2">Change</div>
                      <div className={`text-xl font-bold flex items-center justify-center gap-1 ${
                        selectedMarket.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedMarket.changePercent >= 0 ? '+' : ''}{selectedMarket.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-400 mb-2">High</div>
                      <div className="text-white font-semibold">{formatPrice(selectedMarket.high, selectedMarket.symbol)}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-400 mb-2">Low</div>
                      <div className="text-white font-semibold">{formatPrice(selectedMarket.low, selectedMarket.symbol)}</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Volume</div>
                    <div className="text-white font-semibold">{formatVolume(selectedMarket.volume)}</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trading Controls */}
            {selectedMarket && (
              <Card className="bg-gray-800 border-gray-700 shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold text-white">Place Trade</CardTitle>
                  <p className="text-gray-400">Quick trade on {selectedMarket.symbol}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="amount" className="text-gray-300 text-sm font-medium mb-2 block">Investment Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(Number(e.target.value))}
                      min="10"
                      max="10000"
                      className="bg-gray-700 border-gray-600 text-white text-lg py-3"
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration" className="text-gray-300 text-sm font-medium mb-2 block">Trade Duration</Label>
                    <Select value={tradeDuration.toString()} onValueChange={(value) => setTradeDuration(Number(value))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white py-3">
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
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <Button
                      onClick={() => handleTrade('buy')}
                      disabled={isTrading}
                      className="bg-green-600 text-white hover:bg-green-700 disabled:bg-green-800 py-4 text-lg font-semibold shadow-lg"
                    >
                      <TrendingUp className="h-5 w-5 mr-2" />
                      BUY
                    </Button>
                    <Button
                      onClick={() => handleTrade('sell')}
                      disabled={isTrading}
                      className="bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800 py-4 text-lg font-semibold shadow-lg"
                    >
                      <TrendingDown className="h-5 w-5 mr-2" />
                      SELL
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Markets; 