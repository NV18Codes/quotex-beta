import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DubaiVerificationModal from './DubaiVerificationModal';

const VerificationButton = () => {
  const { user, checkDubaiVerificationRequired } = useAuth();
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const isVerificationRequired = checkDubaiVerificationRequired();
  const isVerified = user?.dubaiVerification?.isVerified;
  const verificationStatus = user?.dubaiVerification?.verificationStatus;

  const getStatusDisplay = () => {
    if (isVerified) {
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        text: 'Verified',
        variant: 'outline' as const,
        className: 'text-green-600 border-green-600'
      };
    }

    if (verificationStatus === 'pending') {
      return {
        icon: <Clock className="h-4 w-4 text-yellow-600" />,
        text: 'Under Review',
        variant: 'outline' as const,
        className: 'text-yellow-600 border-yellow-600'
      };
    }

    if (verificationStatus === 'rejected') {
      return {
        icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
        text: 'Rejected',
        variant: 'outline' as const,
        className: 'text-red-600 border-red-600'
      };
    }

    return {
      icon: <Shield className="h-4 w-4 text-blue-600" />,
      text: 'Verify Account',
      variant: 'default' as const,
      className: 'bg-blue-600 hover:bg-blue-700'
    };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setShowVerificationModal(true)}
          variant={statusDisplay.variant}
          className={statusDisplay.className}
          size="sm"
        >
          {statusDisplay.icon}
          <span className="ml-2">{statusDisplay.text}</span>
        </Button>
        
        {user?.liveBalance > 50000 && !isVerified && (
          <Badge variant="outline" className="text-xs text-blue-600 border-blue-600">
            High Balance
          </Badge>
        )}
      </div>

      <DubaiVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />
    </>
  );
};

export default VerificationButton;
