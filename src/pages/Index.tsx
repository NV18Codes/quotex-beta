import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TradingChart from '@/components/TradingChart';
import TradingPanel from '@/components/TradingPanel';
import AccountDashboard from '@/components/AccountDashboard';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Target,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getUnifiedTradeData } from '@/contexts/AuthContext';

const TradingDashboard = () => {
  const { user } = useAuth();
  // Use fixed live balance from user context, no local state fluctuations
  const liveBalance = user?.liveBalance || 0;
  // Only use user's actual trade history
  const { trades: unifiedTrades, stats: unifiedStats } = getUnifiedTradeData(user?.tradeHistory);

  // Remove fallback that triggers getUnifiedTradeData() with no arguments
  // useEffect(() => {
  //   const savedTrades = localStorage.getItem('userTrades');
  //   if (!savedTrades) {
  //     // This will trigger the getUnifiedTradeData function to generate trades
  //     getUnifiedTradeData();
  //   }
  // }, []);

  // Generate mock market data
  const markets = [
    { symbol: 'EUR/USD', currentPrice: 1.0856, changePercent: 0.21, volume: 1250000 },
    { symbol: 'GBP/USD', currentPrice: 1.2647, changePercent: -0.14, volume: 890000 },
    { symbol: 'BTC/USD', currentPrice: 43250, changePercent: 2.98, volume: 2500000 },
    { symbol: 'XAU/USD', currentPrice: 2045, changePercent: 0.59, volume: 850000 }
  ];

  // Live balance is now fixed at $80,000 - no random fluctuations

  // Listen for the 'trades-updated' event
  useEffect(() => {
    const handleUpdate = () => {
      const savedTrades = localStorage.getItem('userTrades');
      if (savedTrades) {
        // Re-parse and update state or force re-render
        window.location.reload(); // TEMP: force reload for instant sync
      }
    };
    window.addEventListener('trades-updated', handleUpdate);
    return () => window.removeEventListener('trades-updated', handleUpdate);
  }, []);

  // Most recent trades for display
  const recentTrades = unifiedTrades
    .filter(trade => trade.status === 'completed')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

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

  const quickStats = [
    {
      title: 'Total Trades',
      value: unifiedStats.totalTrades.toLocaleString(),
      change: '+12 today',
      isPositive: true,
      icon: Target
    },
    {
      title: 'Win Rate',
      value: `${unifiedStats.winRate.toFixed(0)}%`,
      change: '+2.5% this week',
      isPositive: true,
      icon: TrendingUp
    },
    {
      title: 'Total P&L',
      value: unifiedStats.totalProfit > 0 ? `+$${unifiedStats.totalProfit.toFixed(2)}` : `$${unifiedStats.totalProfit.toFixed(2)}`,
      change: '+$1,250 today',
      isPositive: true,
      icon: DollarSign
    },
    {
      title: 'Live Balance',
              value: `$${liveBalance.toLocaleString('en-US')}`,
              change: 'Transferred to crypto wallet',
      isPositive: true,
      icon: Activity
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      {/* Welcome Section */}
      <section className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}!</h1>
              <p className="text-gray-400 mt-2">
                Ready to make your next trade? Current balance:
                <span className="font-semibold text-green-400 ml-1">
                  ${liveBalance.toLocaleString('en-US')}
                </span>
                <span className="text-xs text-gray-500 ml-2">(Live updates)</span>
              </p>
              <div className="flex items-center gap-4 mt-2">
                <Badge className="bg-blue-600 text-white">
                  <Trophy className="h-3 w-3 mr-1" />
                  Professional Trader
                </Badge>
                <Badge className="bg-green-600 text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {user?.winRate}% Win Rate
                </Badge>
                <Badge className="bg-blue-600 text-white">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {unifiedStats.totalProfit > 0 ? `+$${unifiedStats.totalProfit.toFixed(2)}` : `$${unifiedStats.totalProfit.toFixed(2)}`}
                </Badge>
                <Badge className="bg-green-600 text-white">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {liveBalance.toLocaleString('en-US')}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">
                {new Date().toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </div>
              <Badge className="bg-green-600 text-white mt-1">
                <Activity className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Trading Layout: Chart (full width) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <TradingChart />
        </div>
        
        {/* Trade History and Statistics side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Trades */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Active Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] overflow-y-auto pr-2">
                {recentTrades.length > 0 ? (
                  <div className="space-y-3">
                    {recentTrades.map((trade, index) => (
                      <div key={trade.id || index} className="p-3 border border-gray-600 rounded-lg bg-gray-700 hover:bg-gray-650 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              trade.result === 'win' ? 'bg-green-600' : 'bg-red-600'
                            }`}>
                              {trade.result === 'win' ? (
                                <CheckCircle className="h-3 w-3 text-white" />
                              ) : (
                                <XCircle className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="font-bold text-sm text-white">{trade.symbol}</div>
                                <Badge className={trade.type === 'buy' ? 'bg-green-600' : 'bg-red-600'}>
                                  {trade.type.toUpperCase()}
                                </Badge>
                                <Badge className={trade.result === 'win' ? 'bg-green-600' : 'bg-red-600'}>
                                  {trade.result?.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-400">
                                ${trade.amount} • {formatDuration(trade.duration)} • {formatTime(trade.timestamp)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${
                              trade.profit && trade.profit >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {trade.profit && trade.profit >= 0 ? '+' : ''}${trade.profit?.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {trade.profit && trade.amount ? `${((trade.profit / trade.amount) * 100).toFixed(1)}%` : '0%'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg mb-2">No trades found</div>
                    <p className="text-gray-500 text-sm">No completed trades yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Trading Statistics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trading Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-600 rounded-lg bg-gray-700">
                    <div>
                      <div className="text-sm text-gray-400">{stat.title}</div>
                      <div className="text-lg font-bold text-white">{stat.value}</div>
                      <div className={`text-xs mt-1 ${stat.isPositive ? 'text-green-400' : 'text-gray-400'}`}>{stat.change}</div>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.isPositive ? 'bg-green-900/20' : 'bg-gray-600'}`}>
                      <stat.icon className={`h-4 w-4 ${stat.isPositive ? 'text-green-400' : 'text-gray-400'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trading Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TradingPanel />
      </div>

      {/* Market Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {markets.slice(0, 4).map((market, index) => (
              <div key={index} className="p-4 border border-gray-600 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-white">{market.symbol}</div>
                  <div className={`text-sm ${market.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {market.symbol.includes('USD') && !market.symbol.includes('BTC') && !market.symbol.includes('ETH') 
                    ? market.currentPrice.toFixed(4) 
                    : market.currentPrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">
                  Vol: {market.volume >= 1000000 ? `${(market.volume / 1000000).toFixed(1)}M` : `${(market.volume / 1000).toFixed(1)}K`}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
};

const MarketingLanding = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

const IndexContent = () => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <TradingDashboard /> : <MarketingLanding />;
};

const Index = () => {
  return <IndexContent />;
};

export default Index;
