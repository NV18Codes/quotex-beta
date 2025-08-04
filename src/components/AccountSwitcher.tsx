import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AccountSwitcher = () => {
  const { user, switchAccount, currentBalance, isLiveBalanceVisible } = useAuth();

  if (!user) return null;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Account Type</h3>
        <Badge variant={user.accountType === 'demo' ? 'secondary' : 'default'} className="bg-blue-100 text-blue-800">
          {user.accountType.toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-3">
        {/* Demo Account */}
        <Button
          variant={user.accountType === 'demo' ? 'default' : 'outline'}
          className={`w-full justify-start h-auto p-4 ${
            user.accountType === 'demo' ? 'bg-blue-600 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => switchAccount('demo')}
        >
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Demo Account</div>
              <div className="text-sm opacity-80">
                Balance: {formatCurrency(user.demoBalance)}
              </div>
            </div>
          </div>
        </Button>

        {/* Live Account */}
        <Button
          variant={user.accountType === 'live' ? 'default' : 'outline'}
          className={`w-full justify-start h-auto p-4 ${
            user.accountType === 'live' ? 'bg-blue-600 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => switchAccount('live')}
        >
          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5" />
                          <div className="text-left">
                <div className="font-medium">Live Account</div>
                <div className="text-sm opacity-80">
                  {isLiveBalanceVisible 
                    ? `Balance: ${formatCurrency(35000)}`
                    : 'Available at 11:45 PM EST/PST'
                  }
                </div>
              </div>
          </div>
        </Button>
      </div>

      {user.accountType === 'live' && !isLiveBalanceVisible && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-700 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Live balance visible only at 11:45 PM EST/PST</span>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <div className="font-medium mb-1">Current Balance:</div>
          <div className="text-lg font-bold text-blue-600">
            {formatCurrency(currentBalance)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSwitcher; 