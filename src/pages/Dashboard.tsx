"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription } from "../components/ui/alert"
import { 
  User, 
  Download, 
  Search, 
  Settings, 
  LogOut, 
  BarChart3, 
  FileText, 
  Calendar,
  Eye,
  Star,
  Plus,
  Bookmark,
  History,
  Bell,
  Palette,
  Shield,
  Database,
  TrendingUp,
  BookOpen,
  Globe,
  Calculator,
  ArrowRight,
  Home,
  Grid3X3,
  Heart,
  Clock,
  Activity,
  Award,
  Target,
  Zap
} from "lucide-react"
import { ThemeToggle } from "../components/theme-toggle"

interface DownloadHistory {
  datasetId: string
  fileName: string
  fileType: string
  downloadedAt: string
  dataset?: {
    title: string
    category: string
  }
}

interface SearchHistory {
  query: string
  category?: string
  state?: string
  year?: number
  searchedAt: string
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
  }
  dataCategories: string[]
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistory[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'auto',
    notifications: {
      email: true,
      push: false
    },
    dataCategories: []
  })

  const dataCategories = [
    { id: "demographics", name: "Demographics", icon: User, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    { id: "economy", name: "Economy", icon: TrendingUp, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    { id: "education", name: "Education", icon: BookOpen, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
    { id: "health", name: "Healthcare", icon: Shield, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
    { id: "agriculture", name: "Agriculture", icon: Globe, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
    { id: "infrastructure", name: "Infrastructure", icon: Calculator, color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" }
  ]

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser(userData)
        setIsAuthenticated(true)
        fetchUserData()
      } catch (error) {
        console.error("Error parsing user data:", error)
        navigate("/login")
      }
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        setError('No authentication token found')
        return
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setDownloadHistory(data.data.downloadHistory || [])
        setSearchHistory(data.data.searchHistory || [])
        setBookmarks(data.data.bookmarks || [])
        setPreferences(data.data.preferences || preferences)
      } else {
        setError('Failed to fetch user data')
        // If auth fails, redirect to login
        if (response.status === 401) {
          navigate('/login')
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Failed to fetch user data')
      // If network error, redirect to login
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  const handleUpdatePreferences = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      })
      
      const data = await response.json()
      if (data.success) {
        setSuccess('Preferences updated successfully!')
      } else {
        setError(data.message || 'Failed to update preferences')
      }
    } catch (error) {
      setError('Failed to update preferences')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "demographics": return <User className="w-4 h-4" />
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

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="hover:text-blue-600">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Button>
          <ArrowRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-gray-100 font-medium">Dashboard</span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="downloads" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Download className="w-4 h-4 mr-2" />
              Downloads
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Bookmark className="w-4 h-4 mr-2" />
              Bookmarks
            </TabsTrigger>
            <TabsTrigger value="searches" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Search className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h2>
                    <p className="text-blue-100">Track your data exploration journey and manage your preferences</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{downloadHistory.length}</div>
                  <p className="text-xs text-muted-foreground">Files downloaded</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Bookmark className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{bookmarks.length}</div>
                  <p className="text-xs text-muted-foreground">Saved datasets</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Search Queries</CardTitle>
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Search className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{searchHistory.length}</div>
                  <p className="text-xs text-muted-foreground">Searches performed</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Active</div>
                  <p className="text-xs text-muted-foreground">Account verified</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Downloads */}
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Downloads
                  </CardTitle>
                  <CardDescription>Your latest file downloads</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Loading...</p>
                    </div>
                  ) : downloadHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">No downloads yet</p>
                      <Button onClick={() => navigate('/data-portal')} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        <Database className="w-4 h-4 mr-2" />
                        Browse Datasets
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {downloadHistory.slice(0, 5).map((download, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{download.fileName}</p>
                              <p className="text-xs text-gray-500">{download.fileType.toUpperCase()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">{formatDate(download.downloadedAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-purple-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={() => navigate('/data-portal')} 
                      className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                    >
                      <Database className="w-5 h-5 mr-2" />
                      Browse Data
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/data-portal')} 
                      className="h-20 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      <Bookmark className="w-5 h-5 mr-2" />
                      My Bookmarks
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/')} 
                      className="h-20 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <Home className="w-5 h-5 mr-2" />
                      Home Page
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    >
                      <Settings className="w-5 h-5 mr-2" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Downloads Tab */}
          <TabsContent value="downloads" className="space-y-6">
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2 text-blue-600" />
                  Download History
                </CardTitle>
                <CardDescription>All files you've downloaded from our platform</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading your downloads...</p>
                  </div>
                ) : downloadHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No downloads yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Start exploring datasets and downloading files to see them here. Your download history will be automatically tracked.
                    </p>
                    <Button 
                      onClick={() => navigate('/data-portal')}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Browse Datasets
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {downloadHistory.map((download, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{download.fileName}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {download.fileType.toUpperCase()}
                              </Badge>
                              {download.dataset && (
                                <Badge className={`text-xs ${getCategoryColor(download.dataset.category)}`}>
                                  {download.dataset.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(download.downloadedAt)}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/dataset/${download.datasetId}`)}
                            className="mt-2"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks" className="space-y-6">
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bookmark className="w-5 h-5 mr-2 text-purple-600" />
                  My Bookmarks
                </CardTitle>
                <CardDescription>Your saved datasets for quick access</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading your bookmarks...</p>
                  </div>
                ) : bookmarks.length === 0 ? (
                  <div className="text-center py-12">
                    <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bookmarks yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Start bookmarking datasets you find interesting. They'll appear here for quick access later.
                    </p>
                    <Button 
                      onClick={() => navigate('/data-portal')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Browse Datasets
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookmarks.map((bookmark, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                            {getCategoryIcon(bookmark.category)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{bookmark.title}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={`text-xs ${getCategoryColor(bookmark.category)}`}>
                                {bookmark.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {bookmark.state}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {bookmark.year}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/dataset/${bookmark.datasetId}`)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem('token')
                                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/datasets/${bookmark.datasetId}/bookmark`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Authorization': `Bearer ${token}`
                                  }
                                })
                                
                                const data = await response.json()
                                if (data.success) {
                                  setBookmarks(bookmarks.filter(b => b.datasetId !== bookmark.datasetId))
                                  alert('Removed from bookmarks')
                                } else {
                                  alert(data.message || 'Remove bookmark failed')
                                }
                              } catch (error) {
                                alert('Remove bookmark failed')
                              }
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Bookmark className="w-3 h-3 mr-1 fill-current" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search History Tab */}
          <TabsContent value="searches" className="space-y-6">
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2 text-green-600" />
                  Search History
                </CardTitle>
                <CardDescription>Your recent search queries and filters</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading your search history...</p>
                  </div>
                ) : searchHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No search history</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Your search queries will appear here once you start exploring datasets.
                    </p>
                    <Button 
                      onClick={() => navigate('/data-portal')}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Start Searching
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchHistory.map((search, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <Search className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">"{search.query}"</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {search.category && (
                                <Badge className={`text-xs ${getCategoryColor(search.category)}`}>
                                  {search.category}
                                </Badge>
                              )}
                              {search.state && (
                                <Badge variant="outline" className="text-xs">
                                  {search.state}
                                </Badge>
                              )}
                              {search.year && (
                                <Badge variant="outline" className="text-xs">
                                  {search.year}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(search.searchedAt)}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate('/data-portal')}
                            className="mt-2"
                          >
                            <Search className="w-3 h-3 mr-1" />
                            Search Again
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-orange-600" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your account preferences and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Theme Preference</Label>
                    <select
                      id="theme"
                      value={preferences.theme}
                      onChange={(e) => setPreferences({...preferences, theme: e.target.value as 'light' | 'dark' | 'auto'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>

                  <div>
                    <Label>Notification Preferences</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          id="email-notifications"
                          type="checkbox"
                          checked={preferences.notifications.email}
                          onChange={(e) => setPreferences({
                            ...preferences, 
                            notifications: {...preferences.notifications, email: e.target.checked}
                          })}
                          className="rounded"
                        />
                        <Label htmlFor="email-notifications">Email notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          id="push-notifications"
                          type="checkbox"
                          checked={preferences.notifications.push}
                          onChange={(e) => setPreferences({
                            ...preferences, 
                            notifications: {...preferences.notifications, push: e.target.checked}
                          })}
                          className="rounded"
                        />
                        <Label htmlFor="push-notifications">Push notifications</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Favorite Data Categories</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {dataCategories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <input
                            id={`category-${category.id}`}
                            type="checkbox"
                            checked={preferences.dataCategories.includes(category.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPreferences({
                                  ...preferences,
                                  dataCategories: [...preferences.dataCategories, category.id]
                                })
                              } else {
                                setPreferences({
                                  ...preferences,
                                  dataCategories: preferences.dataCategories.filter(c => c !== category.id)
                                })
                              }
                            }}
                            className="rounded"
                          />
                          <Label htmlFor={`category-${category.id}`} className="text-sm">{category.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleUpdatePreferences}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
} 