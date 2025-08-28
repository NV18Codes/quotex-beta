import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle,
  Filter,
  Download,
  Calendar,
  DollarSign,
  Target
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getUnifiedTradeData } from '@/contexts/AuthContext';

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

const RecentTrades = () => {
  const { user, loadTradesFromStorage } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [tradeFilter, setTradeFilter] = useState<'all' | 'buy' | 'sell' | 'win' | 'loss'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Load trades from localStorage on component mount
  useEffect(() => {
    const savedTrades = loadTradesFromStorage();
    setTrades(savedTrades);
  }, [loadTradesFromStorage]);

  // Calculate stats from trades
  const stats = useMemo(() => {
    const completedTrades = trades.filter(trade => trade.status === 'completed');
    const totalTrades = completedTrades.length;
    const winningTrades = completedTrades.filter(trade => trade.result === 'win').length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const totalProfit = completedTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    
    return {
      totalTrades,
      winRate: Math.round(winRate),
      totalProfit: Math.round(totalProfit * 100) / 100,
      winningTrades
    };
  }, [trades]);

  const formatTime = (timestamp: Date | string) => {
    const dateObj = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  const getFilteredTrades = () => {
    let filtered = trades.filter(trade => trade.status === 'completed');

    // Apply type filter
    if (tradeFilter === 'buy') {
      filtered = filtered.filter(trade => trade.type === 'buy');
    } else if (tradeFilter === 'sell') {
      filtered = filtered.filter(trade => trade.type === 'sell');
    } else if (tradeFilter === 'win') {
      filtered = filtered.filter(trade => trade.result === 'win');
    } else if (tradeFilter === 'loss') {
      filtered = filtered.filter(trade => trade.result === 'loss');
    }

    // Apply time filter
    const now = new Date();
    if (timeFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(trade => new Date(trade.timestamp) >= today);
    } else if (timeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(trade => new Date(trade.timestamp) >= weekAgo);
    } else if (timeFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(trade => new Date(trade.timestamp) >= monthAgo);
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const filteredTrades = getFilteredTrades();

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Recent Trades</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            View your complete trading history and performance analytics
          </p>
        </div>

        {/* Responsive grid: stats+filters left, trade history right */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Trading Status: Stats + Filters */}
          <div className="w-full lg:w-1/3 flex-shrink-0 space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Total Trades</div>
                      <div className="text-2xl font-bold text-white">{stats.totalTrades.toLocaleString()}</div>
                    </div>
                    <Target className="h-7 w-7 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Win Rate</div>
                      <div className="text-2xl font-bold text-green-400">{stats.winRate}%</div>
                    </div>
                    <CheckCircle className="h-7 w-7 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Total Profit</div>
                      <div className="text-2xl font-bold text-green-400">${stats.totalProfit.toFixed(2)}</div>
                    </div>
                    <DollarSign className="h-7 w-7 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Winning Trades</div>
                      <div className="text-2xl font-bold text-white">{stats.winningTrades.toLocaleString()}</div>
                    </div>
                    <TrendingUp className="h-7 w-7 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Trade Type</label>
                    <select
                      value={tradeFilter}
                      onChange={(e) => setTradeFilter(e.target.value as any)}
                      className="bg-gray-700 border-gray-600 text-white rounded px-3 py-2 w-full"
                    >
                      <option value="all">All Trades</option>
                      <option value="buy">Buy Trades</option>
                      <option value="sell">Sell Trades</option>
                      <option value="win">Winning Trades</option>
                      <option value="loss">Losing Trades</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Time Period</label>
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value as any)}
                      className="bg-gray-700 border-gray-600 text-white rounded px-3 py-2 w-full"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trade History */}
          <div className="w-full lg:w-2/3">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Trade History
                  </div>
                  <div className="text-sm text-gray-400">
                    Showing {filteredTrades.length} of {trades.length} trades
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTrades.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTrades.map((trade, index) => (
                      <div key={trade.id || index} className="p-6 border border-gray-600 rounded-lg bg-gray-700 hover:bg-gray-650 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              trade.result === 'win' ? 'bg-green-600' : 'bg-red-600'
                            }`}>
                              {trade.result === 'win' ? (
                                <CheckCircle className="h-6 w-6 text-white" />
                              ) : (
                                <XCircle className="h-6 w-6 text-white" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="font-bold text-xl text-white">{trade.symbol}</div>
                                <Badge className={trade.type === 'buy' ? 'bg-green-600' : 'bg-red-600'}>
                                  {trade.type.toUpperCase()}
                                </Badge>
                                <Badge className={trade.result === 'win' ? 'bg-green-600' : 'bg-red-600'}>
                                  {trade.result?.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-400">
                                ${trade.amount} • {formatDuration(trade.duration)} • {formatTime(trade.timestamp)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${
                              trade.profit && trade.profit >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {trade.profit && trade.profit >= 0 ? '+' : ''}${trade.profit?.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-400">
                              {trade.profit && trade.amount ? `${((trade.profit / trade.amount) * 100).toFixed(1)}%` : '0%'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <div className="text-gray-400 text-lg mb-2">No trades found</div>
                    <p className="text-gray-500 text-sm">No completed trades match your current filters</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RecentTrades; 