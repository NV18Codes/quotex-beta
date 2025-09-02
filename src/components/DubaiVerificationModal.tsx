import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface DubaiVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DubaiVerificationModal = ({ isOpen, onClose }: DubaiVerificationModalProps) => {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Dubai Region Verification
          </DialogTitle>
          <DialogDescription>
            Your account verification has been completed successfully.
          </DialogDescription>
        </DialogHeader>

        {/* Verification Completion Message - Full Screen */}
        <div className="text-center py-12">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
              <div>
                <h4 className="text-2xl font-bold text-green-800 mb-3">Account Verification Completed</h4>
                <div className="text-lg text-green-700">
                  <p>Your account is now fully verified and ready for trading and withdrawals.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Close Button */}
          <div className="mt-8">
            <Button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DubaiVerificationModal;
