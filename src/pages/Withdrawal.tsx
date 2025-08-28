import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


import { Badge } from '@/components/ui/badge';
import { CheckCircle, TrendingDown, DollarSign, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Withdrawal = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();



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
                 <div className="text-center py-12">
                   <TrendingDown className="h-16 w-16 text-green-500 mx-auto mb-4" />
                   <h3 className="text-xl font-semibold text-white mb-2">Withdrawals Enabled</h3>
                   <p className="text-gray-400 mb-6">
                     You can now submit withdrawal requests. Standard processing time is 24-48 hours during business days.
                   </p>
                   <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4">
                     <div className="flex items-center gap-3">
                       <CheckCircle className="h-5 w-5 text-green-400" />
                       <div className="text-green-300">
                         <div className="font-medium">Status: Ready for Withdrawals</div>
                         <div className="text-sm text-green-400 mt-1">
                           Withdrawals are now enabled for your account
                         </div>
                       </div>
                     </div>
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
              <h4 className="font-medium text-white mb-2">How long does withdrawal processing take?</h4>
              <p className="text-gray-400">Standard withdrawals are processed within 24-48 hours during business days.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-white mb-2">What are the withdrawal limits?</h4>
              <p className="text-gray-400">Minimum withdrawal: $10 | Maximum withdrawal: Your available balance</p>
            </div>

          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Withdrawal;
