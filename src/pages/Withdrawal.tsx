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

import { Badge } from '@/components/ui/badge';
import { CheckCircle, TrendingDown, DollarSign, Clock, Banknote, CreditCard, ArrowRight, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Withdrawal = () => {
  const { user, isAuthenticated, updateBalance } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [withdrawalForm, setWithdrawalForm] = useState({
    walletAddress: '',
    amount: '2500',
    cryptocurrency: 'BTC',
    confirmWalletAddress: '',
    securityPin: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!withdrawalForm.walletAddress || !withdrawalForm.confirmWalletAddress || !withdrawalForm.securityPin) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (withdrawalForm.walletAddress !== withdrawalForm.confirmWalletAddress) {
      toast({
        title: "Error",
        description: "Wallet addresses do not match",
        variant: "destructive"
      });
      return;
    }

    if (withdrawalForm.securityPin.length !== 6) {
      toast({
        title: "Error",
        description: "Security PIN must be 6 digits",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(withdrawalForm.amount);
    if (amount !== user.liveBalance) {
      toast({
        title: "Error",
        description: "You must withdraw your entire balance. Partial withdrawals are not allowed.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate crypto withdrawal processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update balance (subtract entire balance)
      updateBalance(-amount, 'trade');
      
      const btcAmount = (amount * 0.000023).toFixed(6);
      
      toast({
        title: "Crypto Withdrawal Generated",
        description: `Transaction generated successfully! You will receive ${btcAmount} BTC. Processing time: 1-3 hours.`,
      });

      // Reset form
      setWithdrawalForm({
        walletAddress: '',
        amount: '2500',
        cryptocurrency: 'BTC',
        confirmWalletAddress: '',
        securityPin: ''
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate crypto withdrawal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
          <h1 className="text-3xl font-bold text-white">Withdrawal</h1>
          <p className="text-gray-400 mt-2">Withdraw funds from your trading account</p>
        </div>





        <div className="grid lg:grid-cols-3 gap-8">
          {/* Crypto Account Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <DollarSign className="h-5 w-5" />
                  Crypto Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-400">Total Balance</div>
                    <div className="text-2xl font-bold text-green-400">
                      {user.liveBalance.toFixed(6)} BTC
                    </div>
                    <div className="text-sm text-blue-400">
                      ({formatIndianCurrency(user.liveBalance * 83)})
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400">Available for withdrawal</div>
                    <div className="text-xl font-bold text-green-400">
                      {user.liveBalance.toFixed(6)} BTC
                    </div>
                    <div className="text-sm text-blue-400">
                      ({formatIndianCurrency(user.liveBalance * 83)})
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">Network Fee</div>
                    <div className="text-lg font-bold text-orange-400">
                      0.001 BTC
                    </div>
                    <div className="text-sm text-blue-400">
                      ({formatIndianCurrency(0.001 * 83 * 1000)})
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Send Cryptocurrency Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CreditCard className="h-5 w-5" />
                  Send Cryptocurrency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 mb-6">
                  <div className="text-blue-300 text-sm">
                    <strong>Professional Crypto Withdrawal:</strong> Transfer your entire account balance to your secure cryptocurrency wallet. This transaction will be processed through our secure blockchain network with enterprise-grade security protocols.
                  </div>
                </div>

                <form onSubmit={handleWithdrawalSubmit} className="space-y-6">
                  {/* To Address */}
                  <div className="space-y-2">
                    <Label htmlFor="walletAddress" className="text-white">To Address</Label>
                    <div className="flex gap-2">
                      <Input
                        id="walletAddress"
                        value={withdrawalForm.walletAddress}
                        onChange={(e) => setWithdrawalForm(prev => ({ ...prev, walletAddress: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white flex-1"
                        placeholder="Enter your secure cryptocurrency wallet address (e.g., Bitcoin, Ethereum, USDT)"
                        required
                      />
                      <Button type="button" variant="outline" size="icon" className="bg-gray-700 border-gray-600 text-white">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Amount to Send */}
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-white">Amount to Send (USD)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="amount"
                        type="number"
                        value={withdrawalForm.amount}
                        onChange={(e) => setWithdrawalForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled
                      />
                      <Button type="button" variant="outline" className="bg-gray-700 border-gray-600 text-white">
                        USD
                      </Button>
                    </div>
                    <div className="text-sm text-blue-400">
                      Send Entire Balance (${user.liveBalance.toFixed(2)} USD / {formatIndianCurrency(user.liveBalance * 83)})
                    </div>
                    <div className="text-orange-400 text-sm">
                      Required: You must withdraw your entire balance. Partial withdrawals are not allowed.
                    </div>
                  </div>

                  {/* Withdraw as Cryptocurrency */}
                  <div className="space-y-2">
                    <Label htmlFor="cryptocurrency" className="text-white">Withdraw as Cryptocurrency</Label>
                    <Select
                      value={withdrawalForm.cryptocurrency}
                      onValueChange={(value) => setWithdrawalForm(prev => ({ ...prev, cryptocurrency: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-gray-400">
                      Your USD balance will be converted to the selected cryptocurrency
                    </div>
                  </div>

                  {/* Network Fee */}
                  <div className="space-y-2">
                    <Label htmlFor="networkFee" className="text-white">Network Fee (USD)</Label>
                    <Input
                      id="networkFee"
                      value="5.00"
                      className="bg-gray-700 border-gray-600 text-white"
                      disabled
                    />
                    <div className="text-sm text-gray-400">
                      Standard blockchain network processing fee (approximately $5.00 USD / {formatIndianCurrency(5 * 83)})
                    </div>
                  </div>

                  {/* USD to BTC Conversion */}
                  <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                    <div className="text-white font-medium">USD to BTC Conversion</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">USD Amount:</div>
                        <div className="text-white">${user.liveBalance.toFixed(2)} ({formatIndianCurrency(user.liveBalance * 83)})</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Network Fee:</div>
                        <div className="text-white">$5.00 ({formatIndianCurrency(5 * 83)})</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Exchange Rate (1 USD =):</div>
                        <div className="text-white">0.000023 BTC</div>
                      </div>
                      <div>
                        <div className="text-gray-400">You will receive:</div>
                        <div className="text-green-400 font-bold">{(user.liveBalance * 0.000023).toFixed(6)} BTC</div>
                      </div>
                    </div>
                  </div>

                  {/* Security Verification */}
                  <div className="space-y-4">
                    <div className="text-white font-medium">Security Verification</div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmWalletAddress" className="text-white">Wallet Address Verification</Label>
                      <Input
                        id="confirmWalletAddress"
                        value={withdrawalForm.confirmWalletAddress}
                        onChange={(e) => setWithdrawalForm(prev => ({ ...prev, confirmWalletAddress: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Confirm your wallet address"
                        required
                      />
                      <div className="text-sm text-gray-400">
                        Re-enter your wallet address for security verification
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="securityPin" className="text-white">Security PIN</Label>
                      <Input
                        id="securityPin"
                        type="password"
                        maxLength={6}
                        value={withdrawalForm.securityPin}
                        onChange={(e) => setWithdrawalForm(prev => ({ ...prev, securityPin: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter your 6 digit security PIN"
                        required
                      />
                      <div className="text-sm text-gray-400">
                        Required for cryptocurrency transactions
                      </div>
                    </div>
                  </div>

                  {/* Final Transaction Summary */}
                  <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                    <div className="text-white font-medium">Final Transaction Summary</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">USD Amount:</div>
                        <div className="text-white">${user.liveBalance.toFixed(2)} ({formatIndianCurrency(user.liveBalance * 83)})</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Network Fee:</div>
                        <div className="text-white">$5.00 ({formatIndianCurrency(5 * 83)})</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Cryptocurrency:</div>
                        <div className="text-white">BTC</div>
                      </div>
                      <div>
                        <div className="text-gray-400">You will receive:</div>
                        <div className="text-green-400 font-bold">{(user.liveBalance * 0.000023).toFixed(6)} BTC</div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 animate-spin" />
                        Generating Transaction...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Generate Transaction
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="mt-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Cryptocurrency Withdrawal FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-white mb-2">How long does crypto withdrawal processing take?</h4>
              <p className="text-gray-400">Crypto withdrawals are processed within 1-3 hours. Bitcoin transactions typically take 10-30 minutes to confirm on the blockchain.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-white mb-2">What are the withdrawal requirements?</h4>
              <p className="text-gray-400">You must withdraw your entire balance. Partial withdrawals are not allowed. Minimum network fee: $5.00 USD.</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium text-white mb-2">What cryptocurrencies are supported?</h4>
              <p className="text-gray-400">Bitcoin (BTC), Ethereum (ETH), and Tether (USDT). Your USD balance will be converted to the selected cryptocurrency.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-white mb-2">What is the exchange rate for crypto conversion?</h4>
              <p className="text-gray-400">Current rate: 1 USD = 0.000023 BTC (approximate). Rate may vary based on market conditions and network fees.</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-medium text-white mb-2">Is my wallet address secure?</h4>
              <p className="text-gray-400">Yes, all transactions are processed through our secure blockchain network with enterprise-grade security protocols. Double verification required.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Withdrawal;
