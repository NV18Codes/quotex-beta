import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, User, MapPin, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const VerificationAdmin = () => {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState([
    {
      id: '1',
      userId: '2',
      userName: 'Jonathan George Jeremiah',
      email: 'johathan23j@gmail.com',
      fullName: 'Jonathan George Jeremiah',
      country: 'UAE',
      address: 'Dubai, UAE',
      whyQuotex: 'Professional trading platform with excellent features',
      governmentId: 'Emirates ID',
      submittedAt: new Date('2024-01-15T10:00:00Z'),
      status: 'pending' as const,
      balance: 55000
    }
  ]);

  const handleApprove = (verificationId: string) => {
    setVerifications(prev => 
      prev.map(v => 
        v.id === verificationId 
          ? { ...v, status: 'approved' as const }
          : v
      )
    );
    
    // In a real app, this would update the user's verification status
    // and enable trading
  };

  const handleReject = (verificationId: string) => {
    setVerifications(prev => 
      prev.map(v => 
        v.id === verificationId 
          ? { ...v, status: 'rejected' as const }
          : v
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dubai Verification Admin</h2>
        <Badge variant="outline" className="text-sm">
          {verifications.filter(v => v.status === 'pending').length} Pending
        </Badge>
      </div>

      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          <strong>Admin Panel:</strong> This interface allows administrators to review and approve 
          Dubai region verifications. Verifications are required for users with balances exceeding $50,000 USD.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {verifications.map((verification) => (
          <Card key={verification.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-500" />
                  <div>
                    <CardTitle className="text-lg">{verification.userName}</CardTitle>
                    <p className="text-sm text-gray-600">{verification.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(verification.status)}
                  {getStatusBadge(verification.status)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Full Name:</strong> {verification.fullName}</div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <strong>Country:</strong> {verification.country}
                    </div>
                    <div><strong>Address:</strong> {verification.address}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Account Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Balance:</strong> ${verification.balance.toLocaleString('en-US')}</div>
                    <div><strong>Government ID:</strong> {verification.governmentId}</div>
                    <div><strong>Submitted:</strong> {verification.submittedAt.toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Why Choose Quotex</h4>
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  {verification.whyQuotex}
                </div>
              </div>

              {verification.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleApprove(verification.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(verification.id)}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}

              {verification.status === 'approved' && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Verification Approved</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    User can now continue trading. Verification completed on {new Date().toLocaleDateString()}.
                  </p>
                </div>
              )}

              {verification.status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">Verification Rejected</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    User needs to resubmit verification. Rejected on {new Date().toLocaleDateString()}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VerificationAdmin;
