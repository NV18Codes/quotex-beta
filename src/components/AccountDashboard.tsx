import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, TrendingUp, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatIndianTime } from '@/lib/utils';

const AccountDashboard = () => {
  const { user } = useAuth();
  // Add live timer state for Indian timezone
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live timer update every second for Indian timezone
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getBalanceDisplay = () => {
    const showBalance = true; // Always show balance for now
    return showBalance ? formatCurrency(user.liveBalance) : '****.**';
  };

  return (
    <div className="bg-gray-900 py-8 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Account Info */}
          <Card className="lg:col-span-2 bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-white">
                    Welcome back, {user.name}
                    <Badge className="bg-green-600 text-white">
                      LIVE ACCOUNT
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-1">
                    Manage your trading account and monitor performance
                  </CardDescription>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
                    <Clock className="h-4 w-4" />
                    {formatIndianTime(currentTime)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Balance Section */}
                <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-xl p-6 border border-blue-700">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-400" />
                      Live Balance
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {getBalanceDisplay()}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-green-400 bg-green-900/20 px-3 py-2 rounded-lg border border-green-700">
                    <TrendingUp className="h-4 w-4" />
                    Account Active
                  </div>
                </div>

                {/* Demo Balance */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 border border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      Demo Balance
                    </h4>
                  </div>
                  <div className="text-3xl font-bold text-gray-300 mb-2">
                    {formatCurrency(user.demoBalance)}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-400 bg-gray-700 px-3 py-2 rounded-lg border border-gray-600">
                    <Shield className="h-4 w-4" />
                    Practice Account
                  </div>
                </div>


              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Trading Stats
              </CardTitle>
              <CardDescription className="text-gray-400">Overall performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-400">Total Trades</span>
                  <span className="font-semibold text-white">{user.totalTrades.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg">
                  <span className="text-sm text-gray-400">Win Rate</span>
                  <span className="font-semibold text-green-400">{user.winRate}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg">
                  <span className="text-sm text-gray-400">Total P&L</span>
                  <span className="font-semibold text-green-400">+{formatCurrency(user.totalPnL)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg">
                  <span className="text-sm text-gray-400">Live Balance</span>
                  <span className="font-semibold text-blue-400">{formatCurrency(user.liveBalance)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-400 bg-green-900/20 p-3 rounded-lg border border-green-700">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  Performance trending upward
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;