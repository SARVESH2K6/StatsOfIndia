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
  Upload,
  Bookmark,
  History,
  Bell,
  Palette,
  Shield,
  Database,
  TrendingUp,
  BookOpen,
  Globe,
  Calculator
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
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'auto',
    notifications: {
      email: true,
      push: false
    },
    dataCategories: []
  })

  const dataCategories = [
    { id: "demographics", name: "Demographics", icon: User, color: "bg-blue-100 text-blue-800" },
    { id: "economy", name: "Economy", icon: TrendingUp, color: "bg-green-100 text-green-800" },
    { id: "education", name: "Education", icon: BookOpen, color: "bg-purple-100 text-purple-800" },
    { id: "health", name: "Healthcare", icon: Shield, color: "bg-red-100 text-red-800" },
    { id: "agriculture", name: "Agriculture", icon: Globe, color: "bg-yellow-100 text-yellow-800" },
    { id: "infrastructure", name: "Infrastructure", icon: Calculator, color: "bg-gray-100 text-gray-800" }
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
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setDownloadHistory(data.data.downloadHistory || [])
        setSearchHistory(data.data.searchHistory || [])
        setPreferences(data.data.preferences || preferences)
      } else {
        setError('Failed to fetch user data')
      }
    } catch (error) {
      setError('Error connecting to server')
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
      setError('Error updating preferences')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    StatsOfIndia
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">User Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{user?.fullName}</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  User
                </Badge>
              </div>
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="searches">Search History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{downloadHistory.length}</div>
                  <p className="text-xs text-muted-foreground">Files downloaded</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Search Queries</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{searchHistory.length}</div>
                  <p className="text-xs text-muted-foreground">Searches performed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Favorite Categories</CardTitle>
                  <Bookmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{preferences.dataCategories.length}</div>
                  <p className="text-xs text-muted-foreground">Categories saved</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Active</div>
                  <p className="text-xs text-muted-foreground">Account verified</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Downloads</CardTitle>
                  <CardDescription>Your latest file downloads</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : downloadHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No downloads yet</p>
                      <Button onClick={() => navigate('/data-portal')} className="mt-4">
                        Browse Datasets
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {downloadHistory.slice(0, 5).map((download, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-8 h-8 text-blue-500" />
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

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => navigate('/data-portal')} className="h-20">
                      <Database className="w-5 h-5 mr-2" />
                      Browse Data
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/data-portal')} className="h-20">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Data
                    </Button>
                    <Button variant="outline" className="h-20">
                      <Bookmark className="w-5 h-5 mr-2" />
                      Bookmarks
                    </Button>
                    <Button variant="outline" className="h-20">
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
            <Card>
              <CardHeader>
                <CardTitle>Download History</CardTitle>
                <CardDescription>All files you've downloaded</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : downloadHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No downloads yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start exploring datasets and downloading files to see them here.
                    </p>
                    <Button onClick={() => navigate('/data-portal')}>
                      Browse Datasets
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {downloadHistory.map((download, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium">{download.fileName}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{download.fileType.toUpperCase()}</span>
                              <span>{formatDate(download.downloadedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download Again
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search History Tab */}
          <TabsContent value="searches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search History</CardTitle>
                <CardDescription>Your recent search queries</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : searchHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No search history</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Your search queries will appear here once you start searching.
                    </p>
                    <Button onClick={() => navigate('/data-portal')}>
                      Start Searching
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchHistory.map((search, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Search className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium">"{search.query}"</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              {search.category && <span>Category: {search.category}</span>}
                              {search.state && <span>State: {search.state}</span>}
                              {search.year && <span>Year: {search.year}</span>}
                              <span>{formatDate(search.searchedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Search className="w-4 h-4 mr-2" />
                          Search Again
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-6">
                  {/* Theme Settings */}
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <select
                      id="theme"
                      value={preferences.theme}
                      onChange={(e) => setPreferences({...preferences, theme: e.target.value as 'light' | 'dark' | 'auto'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="auto">Auto</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                  {/* Notification Settings */}
                  <div className="space-y-4">
                    <Label>Notifications</Label>
                    <div className="space-y-2">
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

                  {/* Favorite Categories */}
                  <div className="space-y-4">
                    <Label>Favorite Data Categories</Label>
                    <div className="grid grid-cols-2 gap-2">
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
                          <Label htmlFor={`category-${category.id}`} className="text-sm">
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleUpdatePreferences} className="w-full">
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