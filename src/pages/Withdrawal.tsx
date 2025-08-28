import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DubaiVerificationModal from '@/components/DubaiVerificationModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, TrendingDown, DollarSign, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Withdrawal = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showVerificationModal, setShowVerificationModal] = useState(false);



  // Check if user is verified - For now, show as completed
  const isVerified = true; // Set to true to show completion message
  const verificationStatus = 'completed';

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);



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

        {/* Verification Completion Message */}
        {isVerified && (
          <Alert className="mb-6 border-green-600 bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-300">
                             <strong>Verification Status: Completed</strong> - Expect a call within the next 7 business days from our verification team. 
              Withdrawal requests will be enabled after the verification call is completed.
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
                    ${user.liveBalance.toLocaleString('en-US')}
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
                      {isVerified ? "Completed" : "Not Verified"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

                     {/* Withdrawal Status */}
           <div className="lg:col-span-2">
             <Card className="bg-gray-800 border-gray-700">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-white">
                   <TrendingDown className="h-5 w-5" />
                   Withdrawal Status
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 {isVerified ? (
                   <div className="text-center py-12">
                     <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                     <h3 className="text-xl font-semibold text-white mb-2">Withdrawal Temporarily Disabled</h3>
                     <p className="text-gray-400 mb-6">
                       Withdrawal requests are currently disabled until the verification call is completed. 
                       You will be able to submit withdrawal requests after our verification team contacts you.
                     </p>
                     <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
                       <div className="flex items-center gap-3">
                         <Clock className="h-5 w-5 text-blue-400" />
                         <div className="text-blue-300">
                           <div className="font-medium">Status: Awaiting Verification Call</div>
                           <div className="text-sm text-blue-400 mt-1">
                                                           Expect a call within the next 7 business days from our verification team
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 ) : (
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
