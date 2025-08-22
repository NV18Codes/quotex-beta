import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DubaiVerificationModal from '@/components/DubaiVerificationModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, TrendingDown, DollarSign, Clock, FileText, MapPin, User, Phone, Banknote, CreditCard, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Withdrawal = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const [withdrawalData, setWithdrawalData] = useState({
    amount: '10',
    paymentMethod: 'Net Banking',
    firstName: 'JOSHUA',
    lastName: 'KENNETH JOSEPH',
    address: '#13/5 1st cross,anjenappa block, Bangalore- 560046.',
    phone: '',
    ifscCode: 'abcd0999999',
    accountNumber: ''
  });

  // Check if user is verified
  const isVerified = user?.dubaiVerification?.isVerified;
  const verificationStatus = user?.dubaiVerification?.verificationStatus;

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check verification status
    if (!isVerified) {
      setShowVerificationModal(true);
      return;
    }

    const amount = parseFloat(withdrawalData.amount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    if (amount > (user?.liveBalance || 0)) {
      toast({
        title: "Insufficient Balance",
        description: "Your withdrawal amount exceeds your available balance.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save withdrawal request to localStorage
      const withdrawalRequest = {
        id: `withdrawal_${Date.now()}`,
        ...withdrawalData,
        amount: amount,
        status: 'pending',
        timestamp: new Date().toISOString(),
        userId: user?.id
      };

      const existingWithdrawals = JSON.parse(localStorage.getItem('userWithdrawals') || '[]');
      existingWithdrawals.push(withdrawalRequest);
      localStorage.setItem('userWithdrawals', JSON.stringify(existingWithdrawals));

      toast({
        title: "Withdrawal Request Submitted",
        description: "Your withdrawal request has been submitted successfully. You will receive confirmation within 24-48 hours.",
      });

      // Reset form
      setWithdrawalData({
        amount: '10',
        paymentMethod: 'Net Banking',
        firstName: 'JOSHUA',
        lastName: 'KENNETH JOSEPH',
        address: '#13/5 1st cross,anjenappa block, Bangalore- 560046.',
        phone: '',
        ifscCode: 'abcd0999999',
        accountNumber: ''
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setWithdrawalData(prev => ({
      ...prev,
      [field]: value
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
          <h1 className="text-3xl font-bold text-white">Withdrawal</h1>
          <p className="text-gray-400 mt-2">Withdraw funds from your trading account</p>
        </div>

        {/* Verification Warning */}
        {!isVerified && (
          <Alert className="mb-6 border-yellow-600 bg-yellow-900/20">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-300">
              <strong>Verification Required:</strong> You must complete Dubai region verification before making withdrawals. 
              <Button 
                onClick={() => setShowVerificationModal(true)}
                variant="outline" 
                size="sm" 
                className="ml-3 border-yellow-600 text-yellow-300 hover:bg-yellow-900/30"
              >
                <Shield className="h-4 w-4 mr-2" />
                Complete Verification
              </Button>
            </AlertDescription>
          </Alert>
        )}

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
                    ${user.liveBalance.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Available for withdrawal</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Account Type</span>
                    <Badge className="bg-green-600 text-white">Live Account</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Verification Status</span>
                    <Badge 
                      variant={isVerified ? "default" : "destructive"}
                      className={isVerified ? "bg-green-600" : "bg-red-600"}
                    >
                      {isVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Withdrawal Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingDown className="h-5 w-5" />
                  Withdrawal Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isVerified ? (
                  <div className="text-center py-12">
                    <Shield className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Verification Required</h3>
                    <p className="text-gray-400 mb-6">
                      To protect your account and comply with regulations, you must complete 
                      Dubai region verification before making withdrawals.
                    </p>
                    <Button 
                      onClick={() => setShowVerificationModal(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Complete Verification
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="amount" className="text-gray-300">Withdrawal Amount (USD)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={withdrawalData.amount}
                          onChange={(e) => handleInputChange('amount', e.target.value)}
                          className="mt-1 bg-gray-700 border-gray-600 text-white"
                          placeholder="Enter amount"
                          min="10"
                          max={user.liveBalance}
                          required
                        />
                        <div className="text-xs text-gray-400 mt-1">
                          Min: $10 | Max: ${user.liveBalance.toLocaleString()}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="paymentMethod" className="text-gray-300">Payment Method</Label>
                        <Select 
                          value={withdrawalData.paymentMethod} 
                          onValueChange={(value) => handleInputChange('paymentMethod', value)}
                        >
                          <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="Net Banking" className="text-white hover:bg-gray-600">
                              <div className="flex items-center gap-2">
                                <Banknote className="h-4 w-4" />
                                Net Banking
                              </div>
                            </SelectItem>
                            <SelectItem value="Credit Card" className="text-white hover:bg-gray-600">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Credit Card
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
                          value={withdrawalData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="mt-1 bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                        <Input
                          id="lastName"
                          value={withdrawalData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="mt-1 bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-gray-300">Address</Label>
                      <Textarea
                        id="address"
                        value={withdrawalData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="mt-1 bg-gray-700 border-gray-600 text-white"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={withdrawalData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-1 bg-gray-700 border-gray-600 text-white"
                          placeholder="+971 50 848 0638"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="ifscCode" className="text-gray-300">IFSC Code</Label>
                        <Input
                          id="ifscCode"
                          value={withdrawalData.ifscCode}
                          onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                          className="mt-1 bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accountNumber" className="text-gray-300">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={withdrawalData.accountNumber}
                        onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                        className="mt-1 bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter your account number"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !isVerified}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-4 w-4 mr-2" />
                          Submit Withdrawal Request
                        </>
                      )}
                    </Button>
                  </form>
                )}
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
              <h4 className="font-medium text-white mb-2">How long does withdrawal processing take?</h4>
              <p className="text-gray-400">Standard withdrawals are processed within 24-48 hours during business days.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-white mb-2">What are the withdrawal limits?</h4>
              <p className="text-gray-400">Minimum withdrawal: $10 | Maximum withdrawal: Your available balance</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium text-white mb-2">Why is verification required?</h4>
              <p className="text-gray-400">Dubai region verification is required for compliance and security purposes.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Modal */}
      <DubaiVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />

      <Footer />
    </div>
  );
};

export default Withdrawal;
