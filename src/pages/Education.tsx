import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  Users, 
  TrendingUp,
  BarChart3,
  Target,
  Shield,
  Award,
  ArrowRight,
  Lock,
  Unlock,
  Video,
  FileText,
  Headphones,
  Calendar,
  User
} from 'lucide-react';

const Education = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Courses', icon: BookOpen },
    { id: 'basics', name: 'Trading Basics', icon: TrendingUp },
    { id: 'strategies', name: 'Trading Strategies', icon: Target },
    { id: 'analysis', name: 'Technical Analysis', icon: BarChart3 },
    { id: 'risk', name: 'Risk Management', icon: Shield },
    { id: 'advanced', name: 'Advanced Trading', icon: Award }
  ];

  const courses = [
    {
      id: 1,
      title: 'Introduction to Binary Options Trading',
      description: 'Learn the fundamentals of binary options trading, including how it works, basic terminology, and market mechanics.',
      category: 'basics',
      duration: '2 hours',
      lessons: 12,
      students: 15420,
      rating: 4.8,
      isFree: true,
      isCompleted: false,
      progress: 0,
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
      instructor: 'Jonathan George Jeremiah',
      level: 'Beginner'
    },
    {
      id: 2,
      title: 'Technical Analysis Fundamentals',
      description: 'Master the essential technical analysis tools including charts, indicators, and pattern recognition.',
      category: 'analysis',
      duration: '4 hours',
      lessons: 18,
      students: 8920,
      rating: 4.9,
      isFree: false,
      isCompleted: false,
      progress: 0,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      instructor: 'Sarah Chen',
      level: 'Intermediate'
    },
    {
      id: 3,
      title: 'Risk Management Strategies',
      description: 'Learn how to protect your capital and manage risk effectively in binary options trading.',
      category: 'risk',
      duration: '3 hours',
      lessons: 15,
      students: 6730,
      rating: 4.7,
      isFree: true,
      isCompleted: false,
      progress: 0,
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
      instructor: 'Michael Rodriguez',
      level: 'Intermediate'
    },
    {
      id: 4,
      title: 'Advanced Trading Strategies',
      description: 'Explore advanced trading strategies including scalping, swing trading, and trend following.',
      category: 'strategies',
      duration: '6 hours',
      lessons: 24,
      students: 4450,
      rating: 4.6,
      isFree: false,
      isCompleted: false,
      progress: 0,
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
      instructor: 'Emma Wilson',
      level: 'Advanced'
    },
    {
      id: 5,
      title: 'Psychology of Trading',
      description: 'Understand the psychological aspects of trading and how to maintain emotional control.',
      category: 'advanced',
      duration: '2.5 hours',
      lessons: 10,
      students: 5670,
      rating: 4.8,
      isFree: true,
      isCompleted: false,
      progress: 0,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      instructor: 'David Thompson',
      level: 'Intermediate'
    },
    {
      id: 6,
      title: 'Market Analysis Masterclass',
      description: 'Learn to analyze market conditions, economic indicators, and news events that affect trading.',
      category: 'analysis',
      duration: '5 hours',
      lessons: 20,
      students: 3340,
      rating: 4.9,
      isFree: false,
      isCompleted: false,
      progress: 0,
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
      instructor: 'Lisa Park',
      level: 'Advanced'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-gray-100 text-gray-800';
      case 'Intermediate': return 'bg-gray-100 text-gray-800';
      case 'Advanced': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartCourse = (courseId: number) => {
    if (!isAuthenticated) {
      // Show login modal or redirect to login
      setIsAuthModalOpen(true);
      return;
    }
    // Navigate to course or start learning
    console.log(`Starting course ${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Trading Education Center</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Master the art of binary options trading with our comprehensive educational resources. 
              From beginner basics to advanced strategies, we've got you covered.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <Badge className="bg-blue-600 text-white">
                <BookOpen className="h-4 w-4 mr-2" />
                {courses.length} Courses Available
              </Badge>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>50,000+ Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>4.8 Average Rating</span>
              </div>
            </div>
            {!isAuthenticated && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gray-700 text-white hover:bg-white hover:text-gray-700 px-8 py-3 text-lg font-semibold"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In to Access
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    {course.isFree ? (
                      <Badge className="bg-green-600 text-white">
                        <Unlock className="h-3 w-3 mr-1" />
                        Free
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-600 text-white">
                        <Lock className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-bold text-white line-clamp-2">
                      {course.title}
                    </CardTitle>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Video className="h-4 w-4" />
                        <span>{course.lessons} lessons</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-gray-400 fill-current" />
                      <span className="text-sm font-medium text-white">{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-400">
                      <Users className="h-4 w-4 inline mr-1" />
                      {course.students.toLocaleString()} students
                    </div>
                    <div className="text-sm text-gray-400">
                      by {course.instructor}
                    </div>
                  </div>
                  
                  {course.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}
                  
                  <Button
                    onClick={() => handleStartCourse(course.id)}
                    className="w-full bg-gray-700 text-white hover:bg-white hover:text-gray-700"
                  >
                    {course.isCompleted ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : course.progress > 0 ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Learning
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No courses found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Learning Paths</h2>
            <p className="text-xl text-gray-400">Follow structured learning paths to master trading step by step</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Beginner Path</h3>
                  <p className="text-gray-300 mb-4">Start your trading journey with the fundamentals</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center justify-between">
                      <span>Basic Concepts</span>
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Market Understanding</span>
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>First Trades</span>
                      <Clock className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white">
                    Start Path
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Intermediate Path</h3>
                  <p className="text-gray-300 mb-4">Develop advanced strategies and analysis skills</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center justify-between">
                      <span>Technical Analysis</span>
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Risk Management</span>
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Strategy Development</span>
                      <Clock className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white">
                    Continue Path
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Advanced Path</h3>
                  <p className="text-gray-300 mb-4">Master professional trading techniques</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center justify-between">
                      <span>Advanced Strategies</span>
                      <Clock className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Psychology Mastery</span>
                      <Clock className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Portfolio Management</span>
                      <Clock className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white">
                    Unlock Path
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Education; 