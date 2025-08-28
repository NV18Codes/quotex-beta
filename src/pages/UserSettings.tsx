import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VerificationButton from '@/components/VerificationButton';
import DubaiVerificationModal from '@/components/DubaiVerificationModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Settings, 
  Palette, 
  Shield, 
  Bell, 
  CreditCard, 
  BarChart3,
  Eye,
  EyeOff,
  Save,
  Download,
  Upload,
  Trash2,
  Key,
  Mail,
  Phone,
  Globe,
  Moon,
  Sun,
  Monitor,
  LogOut,
  CheckCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

const UserSettings = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [chartTheme, setChartTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    tradeAlerts: true,
    newsAlerts: true
  });
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Show loading or redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'trading', label: 'Trading', icon: BarChart3 },
    { id: 'chart', label: 'Chart Settings', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Key }
  ];

  const chartThemes = [
    { value: 'dark', label: 'Dark Theme', description: 'Professional dark interface' },
    { value: 'light', label: 'Light Theme', description: 'Clean light interface' },
    { value: 'blue', label: 'Blue Theme', description: 'Blue accent colors' },
    { value: 'green', label: 'Green Theme', description: 'Green accent colors' },
    { value: 'red', label: 'Red Theme', description: 'Red accent colors' }
  ];

  const timeframes = [
    { value: '30s', label: '30 Seconds' },
    { value: '1m', label: '1 Minute' },
    { value: '5m', label: '5 Minutes' },
    { value: '15m', label: '15 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '1d', label: '1 Day' }
  ];

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log('Settings saved');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account preferences and trading settings</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-gray-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                      <Input id="firstName" defaultValue="Jonathan" className="mt-1 bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                      <Input id="lastName" defaultValue="George Jeremiah" className="mt-1 bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                      <Input id="email" defaultValue={user?.email} className="mt-1 bg-gray-700 border-gray-600 text-white" disabled />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                      <Input id="phone" defaultValue="+971 50 848 0638" className="mt-1 bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-gray-300">Country</Label>
                      <Select defaultValue="uae">
                        <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="us" className="text-white hover:bg-gray-600">United States</SelectItem>
                          <SelectItem value="uk" className="text-white hover:bg-gray-600">United Kingdom</SelectItem>
                          <SelectItem value="ca" className="text-white hover:bg-gray-600">Canada</SelectItem>
                          <SelectItem value="au" className="text-white hover:bg-gray-600">Australia</SelectItem>
                          <SelectItem value="uae" className="text-white hover:bg-gray-600">United Arab Emirates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone" className="text-gray-300">Timezone</Label>
                      <Select defaultValue="gst">
                        <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="est" className="text-white hover:bg-gray-600">Eastern Time (EST)</SelectItem>
                          <SelectItem value="pst" className="text-white hover:bg-gray-600">Pacific Time (PST)</SelectItem>
                          <SelectItem value="gmt" className="text-white hover:bg-gray-600">Greenwich Mean Time (GMT)</SelectItem>
                          <SelectItem value="gst" className="text-white hover:bg-gray-600">Gulf Standard Time (GST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={handleSaveSettings}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    // Ensure button is always active
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Shield className="h-5 w-5" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-300">Account Type</Label>
                        <div className="mt-1">
                          <Badge className="bg-green-600 text-white">
                            Live Account
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300">Account Status</Label>
                        <div className="mt-1">
                          <Badge className="bg-green-600 text-white">
                            Active
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300">Demo Balance</Label>
                        <div className="text-lg font-semibold text-blue-400">
                          ${user?.demoBalance.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300">Live Balance</Label>
                        <div className="text-lg font-semibold text-green-400">
                          ${user?.liveBalance.toLocaleString('en-US')}
                        </div>
                      </div>
                    </div>
                    
                                         {/* Dubai Verification Section */}
                     <Separator className="bg-gray-700" />
                     <div>
                       <Label className="text-gray-300 mb-3 block">Dubai Region Verification</Label>
                       <div className="space-y-4">
                         {/* Verification Completion Message */}
                         <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4">
                           <div className="flex items-start gap-3">
                             <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                             <div>
                               <h4 className="font-medium text-green-300 mb-2">Account Verification Completed</h4>
                               <div className="text-sm text-green-400">
                                 <p>Expect a call within the next 7 business days from our verification team.</p>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex gap-4">
                      <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'trading' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="h-5 w-5" />
                    Trading Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300">Default Investment Amount</Label>
                      <Input defaultValue="100" className="mt-1 bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Default Trade Time</Label>
                      <Select defaultValue="60">
                        <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {timeframes.map((tf) => (
                            <SelectItem key={tf.value} value={tf.value} className="text-white hover:bg-gray-600">
                              {tf.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Risk Level</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="low" className="text-white hover:bg-gray-600">Low Risk</SelectItem>
                          <SelectItem value="medium" className="text-white hover:bg-gray-600">Medium Risk</SelectItem>
                          <SelectItem value="high" className="text-white hover:bg-gray-600">High Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Auto Trading</Label>
                      <div className="mt-1">
                        <Switch />
                      </div>
                    </div>
                  </div>
                  <Button className="bg-gray-700 text-white hover:bg-white hover:text-gray-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Trading Settings
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'chart' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Palette className="h-5 w-5" />
                    Chart Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-gray-300">Chart Theme</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {chartThemes.map((themeOption) => (
                        <div
                          key={themeOption.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            chartTheme === themeOption.value
                              ? 'border-gray-500 bg-gray-700'
                              : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                          }`}
                          onClick={() => setChartTheme(themeOption.value)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-white">{themeOption.label}</div>
                              <div className="text-sm text-gray-400">{themeOption.description}</div>
                            </div>
                            {chartTheme === themeOption.value && (
                              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-700" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300">Chart Type</Label>
                      <Select defaultValue="candlestick">
                        <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="candlestick" className="text-white hover:bg-gray-600">Candlestick</SelectItem>
                          <SelectItem value="line" className="text-white hover:bg-gray-600">Line Chart</SelectItem>
                          <SelectItem value="bar" className="text-white hover:bg-gray-600">Bar Chart</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Default Timeframe</Label>
                      <Select defaultValue="1m">
                        <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {timeframes.map((tf) => (
                            <SelectItem key={tf.value} value={tf.value} className="text-white hover:bg-gray-600">
                              {tf.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300">Show Volume</Label>
                        <div className="text-sm text-gray-400">Display volume bars on chart</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300">Show Grid Lines</Label>
                        <div className="text-sm text-gray-400">Display grid lines on chart</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300">Show Price Line</Label>
                        <div className="text-sm text-gray-400">Display current price line</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <Button className="bg-gray-900 text-white hover:bg-gray-800 border-gray-700 hover:border-gray-600">
                    <Save className="h-4 w-4 mr-2" />
                    Apply Chart Settings
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300">Email Notifications</Label>
                        <div className="text-sm text-gray-400">Receive notifications via email</div>
                      </div>
                      <Switch 
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300">Push Notifications</Label>
                        <div className="text-sm text-gray-400">Receive push notifications</div>
                      </div>
                      <Switch 
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300">SMS Notifications</Label>
                        <div className="text-sm text-gray-400">Receive SMS notifications</div>
                      </div>
                      <Switch 
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300">Trade Alerts</Label>
                        <div className="text-sm text-gray-400">Get notified about trade results</div>
                      </div>
                      <Switch 
                        checked={notifications.tradeAlerts}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, tradeAlerts: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300">News Alerts</Label>
                        <div className="text-sm text-gray-400">Get notified about market news</div>
                      </div>
                      <Switch 
                        checked={notifications.newsAlerts}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newsAlerts: checked }))}
                      />
                    </div>
                  </div>
                  <Button className="bg-gray-900 text-white hover:bg-gray-800 border-gray-700 hover:border-gray-600">
                    <Save className="h-4 w-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Key className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
                    <div className="relative mt-1">
                      <Input 
                        id="currentPassword" 
                        type={showPassword ? 'text' : 'password'} 
                        className="bg-gray-700 border-gray-600 text-white pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
                    <Input id="newPassword" type="password" className="mt-1 bg-gray-700 border-gray-600 text-white" />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" className="mt-1 bg-gray-700 border-gray-600 text-white" />
                  </div>
                  
                  <Separator className="bg-gray-700" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300">Two-Factor Authentication</Label>
                        <div className="text-sm text-gray-400">Add an extra layer of security</div>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300">Login Notifications</Label>
                        <div className="text-sm text-gray-400">Get notified of new login attempts</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button className="bg-gray-900 text-white hover:bg-gray-800 border-gray-700 hover:border-gray-600">
                      <Save className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                    <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
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

export default UserSettings; 