import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Zap, 
  Clock, 
  DollarSign, 
  BarChart3, 
  Users,
  ArrowRight,
  CheckCircle,
  Download,
  User
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthModal from '@/components/AuthModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const BinaryOptions = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Debug: Monitor authentication state
  useEffect(() => {
    console.log('BinaryOptions: Authentication state changed:', isAuthenticated);
  }, [isAuthenticated]);

  const handleStartTrading = () => {
    console.log('Start Trading clicked, isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      // If user is logged in, redirect to dashboard (root path)
      console.log('User is authenticated, redirecting to dashboard...');
      navigate('/');
    } else {
      // If user is not logged in, show auth modal
      console.log('User is not authenticated, showing auth modal...');
      setIsAuthModalOpen(true);
    }
  };

  const handleDownloadPlatform = () => {
    setIsDownloadModalOpen(true);
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure Trading',
      description: 'Bank-level security with encrypted transactions and data protection'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Execute trades in milliseconds with our high-performance platform'
    },
    {
      icon: Clock,
      title: '24/7 Trading',
      description: 'Trade anytime, anywhere with our always-on platform'
    },
    {
      icon: DollarSign,
      title: 'High Returns',
      description: 'Earn up to 98% profit on successful binary options trades'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time charts and technical indicators for informed decisions'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 customer support to help you succeed'
    }
  ];

  const tradingSteps = [
    {
      step: '01',
      title: 'Choose Your Asset',
      description: 'Select from 100+ trading instruments including forex, crypto, stocks, and commodities'
    },
    {
      step: '02',
      title: 'Set Investment Amount',
      description: 'Start with as little as $10 and choose your investment amount'
    },
    {
      step: '03',
      title: 'Predict Price Movement',
      description: 'Predict whether the asset price will go UP or DOWN within the time frame'
    },
    {
      step: '04',
      title: 'Wait for Results',
      description: 'Wait for the trade to expire and collect your profits if correct'
    }
  ];

  const benefits = [
    'No complex charts or analysis required',
    'Fixed risk and reward structure',
    'Quick trade execution',
    'High profit potential (up to 98%)',
    'Wide range of trading instruments',
    'Mobile-friendly platform',
    '24/7 trading availability',
    'Professional customer support'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Binary Options Trading
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Master the art of binary options trading with our comprehensive guide. 
              Learn how to predict market movements and earn consistent profits.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={handleStartTrading}
                className="bg-gray-700 text-white hover:bg-white hover:text-gray-700 px-8 py-3 text-lg font-semibold"
              >
                <User className="h-4 w-4 mr-2" />
                {isAuthenticated ? 'Go to Dashboard' : 'Start Trading'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-gray-700 text-white border-gray-600 hover:bg-white hover:text-gray-700 transition-colors duration-200"
                onClick={handleDownloadPlatform}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Platform
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Binary Options?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Binary options offer a simple yet powerful way to trade financial markets with fixed risk and reward.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Binary Options Work</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Binary options trading is simple and straightforward. Here's how it works in 4 easy steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tradingSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits of Binary Options Trading</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Example Trade</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Asset:</span>
                  <span className="font-semibold text-gray-900">EUR/USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Investment:</span>
                  <span className="font-semibold text-gray-900">$100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prediction:</span>
                  <span className="font-semibold text-green-600">UP ↑</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Frame:</span>
                  <span className="font-semibold text-gray-900">5 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Potential Profit:</span>
                  <span className="font-semibold text-green-600">$98 (98%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Potential Loss:</span>
                  <span className="font-semibold text-red-600">$100 (100%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {isAuthenticated ? 'Ready to Trade?' : 'Ready to Start Trading?'}
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            {isAuthenticated 
              ? 'Access your dashboard and start trading with your live account. Monitor your positions and track your profits.'
              : 'Join thousands of traders who are already earning profits with binary options. Start with a demo account to practice risk-free.'
            }
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 transition-colors duration-200"
              onClick={handleStartTrading}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Open Demo Account'}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700 transition-colors duration-200">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
             {/* Download Platform Modal */}
       <Dialog open={isDownloadModalOpen} onOpenChange={setIsDownloadModalOpen}>
         <DialogContent className="sm:max-w-lg bg-white border-0 shadow-2xl rounded-2xl">
           <DialogHeader className="pb-4">
             <DialogTitle className="text-center text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
               🚀 Coming Soon!
             </DialogTitle>
           </DialogHeader>
           <div className="text-center px-2">
             <div className="mb-8">
               <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                 <Download className="h-12 w-12 text-white" />
               </div>
               <h3 className="text-2xl font-bold text-gray-800 mb-4">
                 Mobile Trading Platform
               </h3>
                               <p className="text-gray-600 leading-relaxed text-lg max-w-md mx-auto">
                  Our powerful mobile trading platform is currently in development and will be available soon.
                </p>
             </div>
             
             
             
             <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8 shadow-sm">
               <p className="text-base text-blue-800 font-medium">
                 <span className="text-lg">✨</span> Stay tuned! We'll notify you as soon as the mobile platform is ready for download.
               </p>
             </div>
             
             <Button 
               onClick={() => setIsDownloadModalOpen(false)}
               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
             >
               Got it! 👍
             </Button>
           </div>
         </DialogContent>
       </Dialog>
    </div>
  );
};

export default BinaryOptions; 