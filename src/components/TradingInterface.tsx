import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Asset } from '@/data/mockData';
import { TrendingUp, TrendingDown, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TradingInterfaceProps {
  selectedAsset: Asset;
  investment: number;
  setInvestment: (value: number) => void;
  formatPrice: (price: number) => string;
  formatCurrency: (amount: number) => string;
}

const TradingInterface = ({ 
  selectedAsset, 
  investment, 
  setInvestment, 
  formatPrice, 
  formatCurrency 
}: TradingInterfaceProps) => {
  const { user, currentBalance, isAuthenticated } = useAuth();
  const [expiryTime, setExpiryTime] = useState('15:00');

  const potentialProfit = Math.floor(investment * 0.98);
  const potentialLoss = investment;

  const canTrade = () => {
    if (!isAuthenticated) return false;
    if (user?.accountType === 'demo') return true;
    if (user?.accountType === 'live' && currentBalance > 0) return true;
    return false;
  };

  const handleInvestmentChange = (value: string) => {
    const numValue = Number(value);
    if (numValue >= 10 && numValue <= 10000) {
      setInvestment(numValue);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Trade {selectedAsset.symbol}</h3>
        <Badge variant="outline" className="text-xs">
          Binary Options
        </Badge>
      </div>
      
      <div className="space-y-6">
        {/* Current Price Display */}
        <div className="bg-gradient-to-r from-trading-surface to-trading-surface-hover rounded-lg p-4 border border-border">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {formatPrice(selectedAsset.price)}
            </div>
            <div className={`text-sm font-medium ${
              selectedAsset.changePercent >= 0 ? 'text-trading-bull' : 'text-trading-bear'
            }`}>
              {selectedAsset.changePercent >= 0 ? '+' : ''}{selectedAsset.changePercent.toFixed(2)}%
              <span className="ml-2 text-muted-foreground">
                ({selectedAsset.change >= 0 ? '+' : ''}{selectedAsset.change.toFixed(2)})
              </span>
            </div>
          </div>
        </div>

        {/* Investment Amount */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Investment Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={investment}
              onChange={(e) => handleInvestmentChange(e.target.value)}
              className="pl-10"
              min="10"
              max="10000"
              step="10"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Min: $10</span>
            <span>Max: $10,000</span>
          </div>
        </div>

        {/* Profit/Loss Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-trading-bull/10 border border-trading-bull/20 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Potential Profit</div>
            <div className="text-lg font-bold text-trading-bull">
              {formatCurrency(potentialProfit)}
            </div>
            <div className="text-xs text-trading-bull">98% ROI</div>
          </div>
          <div className="bg-trading-bear/10 border border-trading-bear/20 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Potential Loss</div>
            <div className="text-lg font-bold text-trading-bear">
              {formatCurrency(potentialLoss)}
            </div>
            <div className="text-xs text-trading-bear">100% Risk</div>
          </div>
        </div>

        {/* Trading Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-trading-bull hover:bg-trading-bull/90 h-14 text-lg font-bold"
            disabled={!canTrade()}
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            CALL ↑ (Price Goes Up)
          </Button>
          <Button 
            className="w-full bg-trading-bear hover:bg-trading-bear/90 h-14 text-lg font-bold"
            disabled={!canTrade()}
          >
            <TrendingDown className="h-5 w-5 mr-2" />
            PUT ↓ (Price Goes Down)
          </Button>
        </div>

        {/* Expiry Time */}
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Expires in: {expiryTime}</span>
        </div>





        {/* Warning Messages */}
        {!canTrade() && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm p-3 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {!isAuthenticated 
              ? 'Please log in to start trading' 
              : 'Insufficient balance or account not accessible'
            }
          </div>
        )}

        {/* Account Info */}
        {isAuthenticated && user && (
          <div className="bg-trading-surface rounded-lg p-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Account:</span>
              <span className="font-medium">{user.accountType.toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-muted-foreground">Balance:</span>
              <span className="font-medium">{formatCurrency(currentBalance)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingInterface; 