"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { 
  BarChart3, 
  Database, 
  Download, 
  Search, 
  Users, 
  TrendingUp, 
  Shield, 
  Globe, 
  BookOpen, 
  Calculator,
  ArrowRight,
  Star,
  FileText,
  MapPin,
  Calendar,
  Eye,
  Bookmark,
  BookmarkPlus,
  Play,
  Zap,
  Target,
  Award,
  CheckCircle,
  ArrowUpRight
} from "lucide-react"
import { ThemeToggle } from "../components/theme-toggle"

interface Dataset {
  _id: string
  title: string
  description: string
  category: string
  state: string
  year: number
  files: Array<{
    fileName: string
    fileType: string
    fileSize: number
  }>
  statistics: {
    downloadCount: number
    viewCount: number
    rating: {
      average: number
      count: number
    }
  }
  createdAt: string
}

export default function HomePage() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [recentDatasets, setRecentDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
    
    fetchRecentDatasets()
  }, [])

  const fetchRecentDatasets = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/datasets/recent?limit=6`)
      const data = await response.json()
      
      if (data.success) {
        setRecentDatasets(data.data)
      }
    } catch (error) {
      console.error('Error fetching recent datasets:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "demographics": return <Users className="w-4 h-4" />
      case "economy": return <TrendingUp className="w-4 h-4" />
      case "education": return <BookOpen className="w-4 h-4" />
      case "health": return <Shield className="w-4 h-4" />
      case "agriculture": return <Globe className="w-4 h-4" />
      case "infrastructure": return <Calculator className="w-4 h-4" />
      default: return <Database className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "demographics": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "economy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "education": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "health": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "agriculture": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "infrastructure": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const features = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Comprehensive Data",
      description: "Access official government datasets from across India"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Advanced Search",
      description: "Find datasets quickly with powerful filtering options"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Easy Downloads",
      description: "Download datasets in multiple formats instantly"
    },
    {
      icon: <Bookmark className="w-6 h-6" />,
      title: "Bookmark & Save",
      description: "Save your favorite datasets for quick access"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Ready",
      description: "Data formatted for analysis and visualization"
    }
  ]

  const stats = [
    { label: "Datasets Available", value: "500+", icon: <Database className="w-5 h-5" /> },
    { label: "States Covered", value: "28", icon: <MapPin className="w-5 h-5" /> },
    { label: "Categories", value: "6", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Years of Data", value: "10+", icon: <Calendar className="w-5 h-5" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-stone-900 dark:via-neutral-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-orange-400/15 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-yellow-400/20 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-amber-300/10 rounded-full animate-spin"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-orange-300/15 rounded-full animate-pulse"></div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-0 shadow-2xl p-8 md:p-12 animate-fade-in">
              <CardContent className="p-0">
                <div className="animate-fade-in-up">
                  <h1 className="text-5xl md:text-7xl font-bold text-stone-900 dark:text-stone-100 mb-6 leading-tight">
                    Discover India's
                    <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent block mt-2">
                      Official Data
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Access comprehensive government datasets, statistics, and insights from across India. 
                    Download, analyze, and visualize official data for research, business, and policy making.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Button 
                      size="lg" 
                      onClick={() => navigate('/data-portal')}
                      className="text-lg px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-bounce-in"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Explore Datasets
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    {!isLoggedIn && (
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => navigate('/register')}
                        className="text-lg px-8 py-4 border-2 border-amber-200 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/20 transition-all duration-300 transform hover:scale-105 animate-bounce-in-delayed"
                      >
                        <Users className="w-5 h-5 mr-2" />
                        Get Started Free
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-white/20 backdrop-blur-md border-0 shadow-2xl p-8 animate-slide-up">
            <CardContent className="p-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <div className="text-white">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-stone-900 dark:text-stone-100 mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-stone-600 dark:text-stone-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4 animate-fade-in-up">
              Why Choose StatsOfIndia?
            </h2>
            <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto animate-fade-in-up-delayed">
              Comprehensive, reliable, and easy-to-use platform for accessing official Indian government data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/20 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-stone-900 dark:text-stone-100">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-stone-600 dark:text-stone-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Datasets Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Latest Datasets
            </h2>
            <p className="text-xl text-stone-600 dark:text-stone-400">
              Discover recently added government datasets
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-stone-600 dark:text-stone-400">Loading datasets...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentDatasets.map((dataset, index) => (
                <Card key={dataset._id} className="bg-white/30 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer animate-fade-in-up" 
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => navigate(`/dataset/${dataset._id}`)}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(dataset.category)}
                        <Badge className={getCategoryColor(dataset.category)}>
                          {dataset.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-stone-500 min-w-0">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                        <span className="truncate">{dataset.statistics.rating.average.toFixed(1)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 text-stone-900 dark:text-stone-100">{dataset.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-stone-600 dark:text-stone-400">
                      {dataset.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-400">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{dataset.state === 'all-india' ? 'All India' : dataset.state}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{dataset.year}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-400">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span>{dataset.files[0]?.fileType.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>{formatFileSize(dataset.files[0]?.fileSize || 0)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-400">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>{dataset.statistics.viewCount} views</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>{dataset.statistics.downloadCount} downloads</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-amber-200 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/20"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/dataset/${dataset._id}`)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-amber-200 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/20"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Bookmark functionality will be added
                          }}
                        >
                          <BookmarkPlus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => navigate('/data-portal')}
              className="text-lg px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              View All Datasets
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="bg-white/20 backdrop-blur-md border-0 shadow-2xl p-8 md:p-12 animate-fade-in-up">
            <CardContent className="p-0">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold text-stone-900 dark:text-stone-100 mb-6">
                  Ready to Explore India's Data?
                </h2>
                <p className="text-xl text-stone-600 dark:text-stone-400 mb-8">
                  Join thousands of researchers, analysts, and policymakers who trust StatsOfIndia for their data needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={() => navigate('/data-portal')}
                    className="text-lg px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Start Exploring
                  </Button>
                  {!isLoggedIn && (
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => navigate('/register')}
                      className="text-lg px-8 py-3 border-2 border-amber-200 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/20"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Create Account
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900/80 backdrop-blur-md text-stone-100 py-12 dark:bg-stone-950/80">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">StatsOfIndia</h3>
                  <p className="text-sm text-stone-400">Official Data Portal</p>
                </div>
              </div>
              <p className="text-stone-400">
                Access comprehensive government datasets and statistics from across India.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-stone-400">
                <li><a href="/data-portal" className="hover:text-stone-100 transition-colors">Browse Data</a></li>
                <li><a href="/dashboard" className="hover:text-stone-100 transition-colors">Dashboard</a></li>
                <li><a href="/login" className="hover:text-stone-100 transition-colors">Login</a></li>
                <li><a href="/register" className="hover:text-stone-100 transition-colors">Register</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-stone-400">
                <li><a href="/data-portal?category=demographics" className="hover:text-stone-100 transition-colors">Demographics</a></li>
                <li><a href="/data-portal?category=economy" className="hover:text-stone-100 transition-colors">Economy</a></li>
                <li><a href="/data-portal?category=education" className="hover:text-stone-100 transition-colors">Education</a></li>
                <li><a href="/data-portal?category=health" className="hover:text-stone-100 transition-colors">Healthcare</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-stone-400">
                <li><a href="#" className="hover:text-stone-100 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-stone-100 transition-colors">Contact Us</a></li>
                <li><a href="/privacy" className="hover:text-stone-100 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-stone-100 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-stone-800 mt-8 pt-8 text-center text-stone-400">
            <p>&copy; 2024 StatsOfIndia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
