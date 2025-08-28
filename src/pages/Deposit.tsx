import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, CreditCard, Banknote, CheckCircle, Clock, Shield, Star, Zap, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Deposit = () => {
  const { user, isAuthenticated, updateBalance } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [depositData, setDepositData] = useState({
    amount: '100',
    paymentMethod: 'Bank Transfer',
            firstName: 'JUSTIN',
        lastName: 'RAJU AROKIASWAMY',
        email: 'justin@thealphaandomega.org',
        phone: '+91 84828 67180'
  });

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(depositData.amount);
    
    if (isNaN(amount) || amount < 10) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount (minimum $10).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save deposit request to localStorage
      const depositRequest = {
        id: `deposit_${Date.now()}`,
        ...depositData,
        amount: amount,
        status: 'pending',
        timestamp: new Date().toISOString(),
        userId: user?.id
      };

      const existingDeposits = JSON.parse(localStorage.getItem('userDeposits') || '[]');
      existingDeposits.push(depositRequest);
      localStorage.setItem('userDeposits', JSON.stringify(existingDeposits));

      // Simulate successful deposit
      if (updateBalance) {
        updateBalance(amount, 'deposit');
      }

      toast({
        title: "Deposit Successful!",
        description: `Successfully deposited $${amount.toFixed(2)} to your account.`,
      });

      // Reset form
      setDepositData({
        amount: '100',
        paymentMethod: 'Bank Transfer',
        firstName: 'JUSTIN',
        lastName: 'RAJU AROKIASWAMY',
        email: 'justin@thealphaandomega.org',
        phone: '+91 84828 67180'
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process deposit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setDepositData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuickAmount = (amount: number) => {
    setDepositData(prev => ({
      ...prev,
      amount: amount.toString()
    }));
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Deposit</h1>
          <p className="text-gray-400 mt-2">Add funds to your trading account</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Account Information */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <DollarSign className="h-5 w-5" />
                  Account Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    ${user.liveBalance.toLocaleString('en-US')}
                  </div>
                  <div className="text-sm text-gray-400">Current balance</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Account Type</span>
                    <Badge className="bg-green-600 text-white">Live Account</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">User ID</span>
                    <span className="text-sm text-gray-400 font-mono">{user.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Amount Selection */}
            <Card className="mt-6 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAmount(amount)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deposit Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5" />
                  Deposit Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="amount" className="text-gray-300">Deposit Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={depositData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        className="mt-1 bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter amount"
                        min="10"
                        required
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Minimum deposit: $10
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="paymentMethod" className="text-gray-300">Payment Method</Label>
                      <Select 
                        value={depositData.paymentMethod} 
                        onValueChange={(value) => handleInputChange('paymentMethod', value)}
                      >
                        <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="Bank Transfer" className="text-white hover:bg-gray-600">
                            <div className="flex items-center gap-2">
                              <Banknote className="h-4 w-4" />
                              Bank Transfer
                            </div>
                          </SelectItem>
                          <SelectItem value="Net Banking" className="text-white hover:bg-gray-600">
                            <div className="flex items-center gap-2">
                              <Banknote className="h-4 w-4" />
                              Net Banking
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                      <Input
                        id="firstName"
                        value={depositData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="mt-1 bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                      <Input
                        id="lastName"
                        value={depositData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="mt-1 bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={depositData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1 bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={depositData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1 bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Submit Deposit Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Payment Method Information */}
            <Card className="mt-6 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Payment Method Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <Banknote className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <h4 className="font-medium text-white mb-1">Bank Transfer</h4>
                    <p className="text-sm text-gray-400">1-3 business days</p>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <Shield className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-medium text-white mb-1">Secure</h4>
                    <p className="text-sm text-gray-400">256-bit encryption</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="mt-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-white mb-2">How long does deposit processing take?</h4>
              <p className="text-gray-400">Bank transfers take 1-3 business days to process and reflect in your account.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-white mb-2">What are the deposit limits?</h4>
              <p className="text-gray-400">Minimum deposit: $10 | Maximum deposit: $50,000 per transaction</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium text-white mb-2">Is my payment information secure?</h4>
              <p className="text-gray-400">Yes, we use industry-standard 256-bit encryption to protect your data.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Deposit;
