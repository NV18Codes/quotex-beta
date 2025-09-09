import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  BarChart3
} from 'lucide-react';

interface Transaction {
  id: string;
  order: string;
  date: string;
  status: 'succeeded' | 'failed' | 'pending';
  type: 'deposit' | 'withdrawal' | 'payout' | 'trade';
  paymentSystem: string;
  amount: number;
  timestamp: Date;
}

const Transactions = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'trade' | 'payout'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Load transactions from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions();
    }
  }, [isAuthenticated]);

  const loadTransactions = () => {
    // Load trades
    const savedTrades = JSON.parse(localStorage.getItem('userTrades') || '[]');
    const tradeTransactions = savedTrades.map((trade: any) => ({
      id: trade.id,
      order: trade.id.slice(-8).toUpperCase(),
      date: new Date(trade.timestamp).toLocaleDateString('en-GB'),
      status: trade.status === 'completed' ? 'succeeded' : 'pending',
      type: 'trade' as const,
      paymentSystem: 'Trading',
      amount: trade.profit || 0,
      timestamp: new Date(trade.timestamp)
    }));

    // Load withdrawals
    const savedWithdrawals = JSON.parse(localStorage.getItem('userWithdrawals') || '[]');
    const withdrawalTransactions = savedWithdrawals.map((withdrawal: any) => ({
      id: withdrawal.id,
      order: withdrawal.id.slice(-8).toUpperCase(),
      date: new Date(withdrawal.timestamp).toLocaleDateString('en-GB'),
      status: withdrawal.status === 'pending' ? 'pending' : 'succeeded',
      type: 'withdrawal' as const,
      paymentSystem: withdrawal.paymentMethod,
      amount: -withdrawal.amount,
      timestamp: new Date(withdrawal.timestamp)
    }));

    // Load deposits
    const savedDeposits = JSON.parse(localStorage.getItem('userDeposits') || '[]');
    const depositTransactions = savedDeposits.map((deposit: any) => ({
      id: deposit.id,
      order: deposit.id.slice(-8).toUpperCase(),
      date: new Date(deposit.timestamp).toLocaleDateString('en-GB'),
      status: deposit.status === 'pending' ? 'pending' : 'succeeded',
      type: 'deposit' as const,
      paymentSystem: deposit.paymentMethod,
      amount: deposit.amount,
      timestamp: new Date(deposit.timestamp)
    }));

    // Sample deposit transactions to show $60k balance + new $8k deposit
    const sampleDeposits: Transaction[] = [
      {
        id: 'deposit_sample_1',
        order: 'D14000000',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'), // 30 days ago
        status: 'succeeded',
        type: 'deposit',
        paymentSystem: 'Bank Transfer',
        amount: 14000.00,
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'deposit_sample_2',
        order: 'D70000000',
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'), // 25 days ago
        status: 'succeeded',
        type: 'deposit',
        paymentSystem: 'Bank Transfer',
        amount: 7000.00,
        timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'deposit_sample_3',
        order: 'D14000001',
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'), // 20 days ago
        status: 'succeeded',
        type: 'deposit',
        paymentSystem: 'Bank Transfer',
        amount: 14000.00,
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'deposit_sample_4',
        order: 'D20000000',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'), // 15 days ago
        status: 'succeeded',
        type: 'deposit',
        paymentSystem: 'Bank Transfer',
        amount: 20000.00,
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'deposit_sample_5',
        order: 'D50000000',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'), // 10 days ago
        status: 'succeeded',
        type: 'deposit',
        paymentSystem: 'Bank Transfer',
        amount: 5000.00,
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'deposit_sample_6',
        order: 'D80000000',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'), // 2 days ago
        status: 'succeeded',
        type: 'deposit',
        paymentSystem: 'Bank Transfer',
        amount: 8000.00,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    // Generate sample trade transactions to ensure 150 trades
    const generateSampleTrades = (): Transaction[] => {
      const sampleTrades: Transaction[] = [];
      const symbols = ['EUR/USD', 'GBP/USD', 'BTC/USD', 'XAU/USD', 'AAPL', 'GOOGL', 'TSLA', 'MSFT'];
      const tradeTypes = ['buy', 'sell'];
      
      for (let i = 0; i < 150; i++) {
        const isWin = Math.random() > 0.4; // 60% win rate
        const amount = Math.floor(Math.random() * 500) + 50; // $50 to $550
        const profit = isWin ? amount * (0.8 + Math.random() * 0.4) : -amount; // 80-120% profit on wins, full loss on losses
        
        sampleTrades.push({
          id: `trade_sample_${i + 1}`,
          order: `T${(i + 1).toString().padStart(8, '0')}`,
          date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'), // Random date within 90 days
          status: 'succeeded',
          type: 'trade',
          paymentSystem: `${symbols[Math.floor(Math.random() * symbols.length)]} ${tradeTypes[Math.floor(Math.random() * tradeTypes.length)].toUpperCase()}`,
          amount: profit,
          timestamp: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
        });
      }
      
      return sampleTrades.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    const sampleTrades = generateSampleTrades();

    // Add the crypto payout transaction
    const payoutTransaction: Transaction = {
      id: 'payout_crypto_eth',
      order: '40731785785',
      date: '06/09/2025',
      status: 'succeeded',
      type: 'payout',
      paymentSystem: 'ETH',
      amount: -100343.00, // Negative amount for withdrawal
      timestamp: new Date() // Use current time to ensure it's at the top
    };

    // Combine all transactions and sort by timestamp
    const allTransactions = [
      payoutTransaction, // Put payout transaction first
      ...tradeTransactions,
      ...withdrawalTransactions,
      ...depositTransactions,
      ...sampleDeposits,
      ...sampleTrades
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    setTransactions(allTransactions);
  };

  // Filter transactions based on current filter and search
  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = transaction.order.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.paymentSystem.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Succeeded</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getAmountDisplay = (amount: number, type: string) => {
    const isPositive = amount >= 0;
    const prefix = isPositive ? '+' : '';
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    
    // For payout transactions, always show in red without plus symbol
    if (type === 'payout') {
      return (
        <span className="font-semibold text-red-600">
          ${Math.abs(amount).toFixed(2)}
        </span>
      );
    }
    
    return (
      <span className={`font-semibold ${color}`}>
        {prefix}${Math.abs(amount).toFixed(2)}
      </span>
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter as any);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // If not authenticated, show loading
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Transactions</h1>
          <p className="text-gray-400">View your transaction history and track your financial activities</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">Filter by Type</Label>
                  <Select value={filter} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="all" className="text-white hover:bg-gray-600">All Transactions</SelectItem>
                      <SelectItem value="deposit" className="text-white hover:bg-gray-600">Deposits</SelectItem>
                      <SelectItem value="withdrawal" className="text-white hover:bg-gray-600">Withdrawals</SelectItem>
                      <SelectItem value="trade" className="text-white hover:bg-gray-600">Trades</SelectItem>
                      <SelectItem value="payout" className="text-white hover:bg-gray-600">Payouts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="relative">
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 w-64 bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="shadow-lg bg-gray-800 border-gray-700">
          <CardHeader className="bg-gray-700 border-b border-gray-600">
            <CardTitle className="flex items-center justify-between text-white">
              <span className="text-xl font-semibold">Transaction History</span>
              <div className="text-sm text-gray-300 bg-gray-600 px-3 py-1 rounded-full border border-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 border-b border-gray-600">Order</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 border-b border-gray-600">Date and time</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 border-b border-gray-600">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 border-b border-gray-600">Transaction type</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 border-b border-gray-600">Payment system</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-300 border-b border-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-600 hover:bg-gray-700 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-white bg-gray-600 px-2 py-1 rounded">{transaction.order}</span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-300">
                        {transaction.date}, {transaction.timestamp.toLocaleTimeString('en-GB', { 
                          hour: '2-digit', 
                          minute: '2-digit', 
                          second: '2-digit' 
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(transaction.status)}
                          {getStatusBadge(transaction.status)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {transaction.type === 'deposit' && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {transaction.type === 'withdrawal' && <TrendingDown className="h-4 w-4 text-red-600" />}
                          {transaction.type === 'payout' && <TrendingDown className="h-4 w-4 text-red-600" />}
                          {transaction.type === 'trade' && <BarChart3 className="h-4 w-4 text-blue-600" />}
                          <span className="capitalize font-medium text-white">{transaction.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-300">
                        {transaction.paymentSystem}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {getAmountDisplay(transaction.amount, transaction.type)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-600 bg-gray-700 px-6 py-4">
                <div className="text-sm text-gray-300">
                  Page <span className="font-medium text-white">{currentPage}</span> of <span className="font-medium text-white">{totalPages}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-gray-600 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-gray-600 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {currentTransactions.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 text-lg mb-3">No transactions found</div>
                <p className="text-gray-500 text-sm mb-6">
                  {searchTerm ? 'Try adjusting your search terms' : 'No transactions match your current filters'}
                </p>
                {!searchTerm && (
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => window.location.href = '/deposit'}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Make Deposit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = '/binary-options'}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Start Trading
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-400 font-medium">Total Deposits</div>
                  <div className="text-3xl font-bold text-green-300">
                    ${transactions
                      .filter(t => t.type === 'deposit' && t.status === 'succeeded')
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toFixed(2)}
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-red-400 font-medium">Total Withdrawals</div>
                  <div className="text-3xl font-bold text-red-300">
                    ${Math.abs(transactions
                      .filter(t => (t.type === 'withdrawal' || t.type === 'payout') && t.status === 'succeeded')
                      .reduce((sum, t) => sum + t.amount, 0))
                      .toFixed(2)}
                  </div>
                </div>
                <TrendingDown className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-blue-400 font-medium">Total Trades</div>
                  <div className="text-3xl font-bold text-blue-300">
                    {transactions.filter(t => t.type === 'trade').length}
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-purple-400 font-medium">Success Rate</div>
                  <div className="text-3xl font-bold text-purple-300">
                    {transactions.length > 0 
                      ? Math.round((transactions.filter(t => t.status === 'succeeded').length / transactions.length) * 100)
                      : 0}%
                  </div>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Transactions;
