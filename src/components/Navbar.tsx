import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  DollarSign,
  BarChart3,
  BookOpen,
  Info,
  Home,
  Clock,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Binary Options', href: '/binary-options', icon: BarChart3 },
    { name: 'Markets', href: '/markets', icon: DollarSign },
    { name: 'Education', href: '/education', icon: BookOpen },
    { name: 'About', href: '/about', icon: Info }
  ];

  const authenticatedNavigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Binary Options', href: '/binary-options', icon: BarChart3 },
    { name: 'Markets', href: '/markets', icon: DollarSign },
    { name: 'Deposit', href: '/deposit', icon: TrendingUp },
    { name: 'Withdrawal', href: '/withdrawal', icon: TrendingDown },
    { name: 'Transactions', href: '/transactions', icon: Clock },
    { name: 'Education', href: '/education', icon: BookOpen },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Quotex
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-1">
              {isAuthenticated ? (
                // Show authenticated navigation when logged in
                <div className="flex items-center space-x-1">
                  {/* Main Navigation Group */}
                  <div className="flex items-center space-x-1 bg-gray-800/50 rounded-lg p-1">
                    {authenticatedNavigation.slice(0, 3).map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            isActive(item.href)
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-gray-300 hover:text-white hover:bg-gray-700/70'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>

                  {/* More Dropdown */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/70 rounded-md transition-all duration-200"
                    >
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      More
                      <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </Button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                        <div className="py-2">
                          {/* Financial Section */}
                          <div className="px-3 py-2">
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                              Financial
                            </div>
                            {authenticatedNavigation.slice(3, 6).map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.name}
                                  to={item.href}
                                  onClick={() => setIsDropdownOpen(false)}
                                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    isActive(item.href)
                                      ? 'bg-green-600 text-white'
                                      : 'text-gray-300 hover:text-white hover:bg-gray-700/70'
                                  }`}
                                >
                                  <Icon className="h-4 w-4 mr-3" />
                                  {item.name}
                                </Link>
                              );
                            })}
                          </div>

                          {/* Other Section */}
                          <div className="px-3 py-2 border-t border-gray-700">
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                              More
                            </div>
                            {authenticatedNavigation.slice(6, 9).map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.name}
                                  to={item.href}
                                  onClick={() => setIsDropdownOpen(false)}
                                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    isActive(item.href)
                                      ? 'bg-purple-600 text-white'
                                      : 'text-gray-300 hover:text-white hover:bg-gray-700/70'
                                  }`}
                                >
                                  <Icon className="h-4 w-4 mr-3" />
                                  {item.name}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Show basic navigation when not logged in
                <div className="flex items-center space-x-1 bg-gray-800/50 rounded-lg p-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          isActive(item.href)
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700/70'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* User Menu / Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                // Authenticated user menu
                <div className="flex items-center space-x-4">
                  {/* User Info Card */}
                  <div className="bg-gray-800/70 rounded-lg px-4 py-2 border border-gray-700">
                    <div className="text-right">
                      <div className="text-sm text-white font-semibold">{user?.name}</div>
                      <div className="text-xs text-gray-400">Live Account</div>
                    </div>
                  </div>
                  
                  {/* Balance Display */}
                  <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg px-4 py-2 shadow-lg">
                    <Badge className="bg-transparent text-white border-0 text-sm font-semibold">
                      ${user?.liveBalance.toLocaleString()}
                    </Badge>
                  </div>
                  
                  {/* Settings & Logout */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
                    >
                      <Link to="/settings">
                        <Settings className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                // Non-authenticated user buttons
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-gray-800/95 border-t border-gray-700 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                // Authenticated mobile navigation
                <>
                  {/* Main Navigation */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
                      Main Navigation
                    </div>
                    {authenticatedNavigation.slice(0, 3).map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                            isActive(item.href)
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-gray-300 hover:text-white hover:bg-gray-700/70'
                          }`}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Financial Navigation */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
                      Financial
                    </div>
                    {authenticatedNavigation.slice(3, 6).map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                            isActive(item.href)
                              ? 'bg-green-600 text-white shadow-md'
                              : 'text-gray-300 hover:text-white hover:bg-gray-700/70'
                          }`}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Secondary Navigation */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
                      More
                    </div>
                    {authenticatedNavigation.slice(6, 9).map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                            isActive(item.href)
                              ? 'bg-purple-600 text-white shadow-md'
                              : 'text-gray-300 hover:text-white hover:bg-gray-700/70'
                          }`}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                  
                  {/* User Info */}
                  <div className="pt-4 pb-3 border-t border-gray-700">
                    <div className="px-3 py-3 bg-gray-700/50 rounded-lg mb-3">
                      <div className="text-sm text-white font-semibold">{user?.name}</div>
                      <div className="text-xs text-gray-400 mb-2">Live Account</div>
                      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg px-3 py-1 inline-block">
                        <Badge className="bg-transparent text-white border-0 text-sm font-semibold">
                          ${user?.liveBalance.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                // Non-authenticated mobile navigation
                <>
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                          isActive(item.href)
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700/70'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    );
                  })}
                  <div className="pt-4 pb-3 border-t border-gray-700">
                    <Button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;