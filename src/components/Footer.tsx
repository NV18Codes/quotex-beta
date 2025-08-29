import { Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, BarChart3, User } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

const Footer = () => {
  const footerLinks = {
    'Trading': [
      'Binary Options',
      'Forex Trading ',
      'Crypto Trading',
      'Stock Trading',
      'Commodities',
      'Indices'
    ],
    'Platform': [
      'Web Platform',
      'Mobile App',
      'API Trading',
      'Analysis Tools',
      'Economic Calendar',
      'Trading Signals'
    ],
    'Education': [
      'Trading Academy',
      'Video Tutorials',
      'eBooks',
      'Webinars',
      'Market Analysis',
      'Trading Strategies'
    ],
    'Support': [
      'Help Center',
      'Contact Us',
      'Live Chat',
      'Account Manager',
      'Technical Support',
      'Complaints'
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white ml-2">Quotex</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              The world's leading binary options trading platform. Trade with confidence 
              and join millions of successful traders worldwide.
            </p>
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-gray-700 text-white hover:bg-white hover:text-gray-700 mb-4"
            >
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>support@qxtrader.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>Financial District, New York</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 text-white">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Licensed & Regulated
              </span>
              <span className="hidden md:block text-gray-600">•</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                SSL Secured
              </span>
              <span className="hidden md:block text-gray-600">•</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                24/7 Support
              </span>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2024 Quotex. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Risk Disclosure
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Cookies Policy
              </a>
            </div>
          </div>
        </div>

        {/* Risk Warning */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-sm text-gray-300 leading-relaxed">
              <strong className="text-yellow-400">Risk Warning:</strong> Trading binary options involves substantial risk and may not be suitable for all investors. 
              You may sustain a loss of some or all of your invested capital and therefore you should not speculate with capital that you cannot afford to lose. 
              You should be aware of all the risks associated with binary options trading and seek advice from an independent financial advisor if you have any doubts.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;