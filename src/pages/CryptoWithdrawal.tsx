import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Send, 
  AlertTriangle, 
  DollarSign, 
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CryptoWithdrawal = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    toAddress: '',
    amount: user?.liveBalance.toString() || '0',
    currency: 'ETH',
    showAdvanced: false,
    data: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Amount is always set to entire balance and cannot be changed
  useEffect(() => {
    if (user?.liveBalance) {
      setFormData(prev => ({
        ...prev,
        amount: user.liveBalance.toString()
      }));
    }
  }, [user?.liveBalance]);

  const validateAddress = (address: string) => {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = async () => {
    if (!validateAddress(formData.toAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum wallet address",
        variant: "destructive"
      });
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to send",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(formData.amount) > (user?.liveBalance || 0)) {
      toast({
        title: "Insufficient Balance",
        description: "Amount exceeds your available balance",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate transaction processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Transaction Generated",
        description: "Your crypto withdrawal transaction has been generated successfully",
      });
      
      // Reset form
      setFormData({
        toAddress: '',
        amount: user?.liveBalance.toString() || '0',
        currency: 'ETH',
        showAdvanced: false,
        data: ''
      });
    }, 2000);
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">Crypto Wallet Transfer</h1>
          </div>
          <p className="text-gray-400">Send your entire balance to an external crypto wallet</p>
        </div>

        {/* Balance Alert */}
        <Alert className="mb-6 border-blue-600 bg-blue-900/20">
          <DollarSign className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-300">
            <strong>Available Balance:</strong> ${user.liveBalance.toLocaleString('en-US')} USD
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Send className="h-5 w-5" />
                  Send Ether & Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* To Address */}
                <div className="space-y-2">
                  <Label htmlFor="toAddress" className="text-white">To Address</Label>
                  <div className="relative">
                    <Input
                      id="toAddress"
                      type="text"
                      placeholder="0xf902fd8B2AEE76AE81bBA106d667cCF368C2f9A1"
                      value={formData.toAddress}
                      onChange={(e) => handleInputChange('toAddress', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-12"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount to Send - Fixed to Entire Balance */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">Amount to Send (Entire Balance)</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        disabled
                        className="bg-gray-600 border-gray-500 text-white cursor-not-allowed"
                      />
                    </div>
                    <Button
                      variant="outline"
                      disabled
                      className="bg-gray-600 border-gray-500 text-white cursor-not-allowed"
                    >
                      {formData.currency}
                    </Button>
                  </div>
                  <div className="text-sm text-blue-400">
                    ✓ Entire balance will be withdrawn
                  </div>
                </div>

                {/* Advanced Options */}
                <div>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }))}
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Advanced: Add Data
                  </button>
                  
                  {formData.showAdvanced && (
                    <div className="mt-3 space-y-2">
                      <Label htmlFor="data" className="text-white">Data (Optional)</Label>
                      <Input
                        id="data"
                        type="text"
                        placeholder="0x..."
                        value={formData.data}
                        onChange={(e) => handleInputChange('data', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  )}
                </div>

                {/* Generate Transaction Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isProcessing || !formData.toAddress || !formData.amount}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating Transaction...
                    </div>
                  ) : (
                    'Generate Transaction'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Amount</span>
                    <span className="text-white font-medium">
                      {formData.amount ? `${formData.amount} ${formData.currency}` : '0 ETH'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Network</span>
                    <Badge className="bg-green-600">Ethereum</Badge>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Available Balance</span>
                    <span className="text-green-400 font-medium">
                      ${user.liveBalance.toLocaleString('en-US')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="mt-6 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Security Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-400 space-y-2">
                  <p>• Double-check the recipient address</p>
                  <p>• Entire balance will be withdrawn</p>
                  <p>• Transactions are irreversible</p>
                  <p>• Keep your private keys secure</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CryptoWithdrawal;
