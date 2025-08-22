import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Clock, Upload, FileText, User, MapPin, Globe, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DubaiVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DubaiVerificationModal = ({ isOpen, onClose }: DubaiVerificationModalProps) => {
  const { user, submitDubaiVerification } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    country: 'UAE',
    address: '',
    whyQuotex: '',
    governmentId: '',
    documentsUploaded: false
  });

  const governmentIdTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID Card' },
    { value: 'driving_license', label: 'Driving License' },
    { value: 'emirates_id', label: 'Emirates ID' },
    { value: 'other', label: 'Other Government ID' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    setFormData(prev => ({
      ...prev,
      documentsUploaded: true
    }));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    if (uploadedFiles.length === 1) {
      setFormData(prev => ({
        ...prev,
        documentsUploaded: false
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.country || !formData.address || !formData.whyQuotex || !formData.governmentId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (uploadedFiles.length === 0) {
      toast({
        title: "Documents Required",
        description: "Please upload at least one government ID document.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Submit verification data
      if (submitDubaiVerification) {
        await submitDubaiVerification({
          fullName: formData.fullName,
          country: formData.country,
          address: formData.address,
          whyQuotex: formData.whyQuotex,
          governmentId: formData.governmentId,
          documentsUploaded: true,
          verificationStatus: 'pending'
        });
      }

      setIsSubmitted(true);
      toast({
        title: "Verification Submitted",
        description: "Your verification request has been submitted successfully.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Thank You!
            </DialogTitle>
            <DialogDescription>
              Your verification request has been submitted successfully.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your Dubai region verification has been submitted successfully. 
                Our compliance team will review your documents and information.
              </AlertDescription>
            </Alert>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Processing & Verification Timeline</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• <strong>Processing Time: 48 hours</strong></p>
                    <p>• Documents will be reviewed by our compliance team</p>
                    <p>• You'll receive email notification upon completion</p>
                    <p>• Trading continues normally during verification</p>
                    <p>• <strong>You cannot confirm or approve your own verification</strong></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Account Verification Completed</h4>
                  <div className="text-sm text-green-700">
                    <p>Expect a call within the next 24 hours from our verification team.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Dubai Region Verification
          </DialogTitle>
          <DialogDescription>
            Complete your identity verification for enhanced account security and compliance.
          </DialogDescription>
        </DialogHeader>

        {/* Verification Completion Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-800 mb-2">Account Verification Completed</h4>
              <div className="text-sm text-green-700">
                <p>Expect a call within the next 24 hours from our verification team.</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name as per Government ID *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full legal name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="country" className="text-sm font-medium">
                  Country *
                </Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UAE">United Arab Emirates</SelectItem>
                    <SelectItem value="SAU">Saudi Arabia</SelectItem>
                    <SelectItem value="KWT">Kuwait</SelectItem>
                    <SelectItem value="QAT">Qatar</SelectItem>
                    <SelectItem value="BHR">Bahrain</SelectItem>
                    <SelectItem value="OMN">Oman</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                Address *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your complete address"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Platform Choice */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Platform Selection</h3>
            
            <div>
              <Label htmlFor="whyQuotex" className="text-sm font-medium">
                Why did you choose Quotex as a platform for trading? *
              </Label>
              <Textarea
                id="whyQuotex"
                value={formData.whyQuotex}
                onChange={(e) => handleInputChange('whyQuotex', e.target.value)}
                placeholder="Please explain your reasons for choosing Quotex..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Document Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Document Verification</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="governmentId" className="text-sm font-medium">
                  Government ID Type *
                </Label>
                <Select value={formData.governmentId} onValueChange={(value) => handleInputChange('governmentId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    {governmentIdTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Upload Government ID Documents *
              </Label>
              <div className="mt-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500 font-medium">
                        Click to upload
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </Label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      PDF, JPG, PNG, DOC up to 10MB each
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Uploaded Documents:</Label>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Important Notice */}
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Important:</strong> You can submit your verification request, but you cannot confirm or approve it yourself. 
              Our compliance team will review your documents and make the final decision within 48 hours.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.documentsUploaded}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Submit Verification Request
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DubaiVerificationModal;
