"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Alert, AlertDescription } from "../components/ui/alert"
import { 
  Building2, 
  Database, 
  Search, 
  Filter, 
  Download, 
  BarChart3, 
  FileText, 
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Shield,
  Globe,
  BookOpen,
  Calculator,
  Eye,
  Star,
  Plus,
  Upload,
  User,
  LogIn
} from "lucide-react"
import { ThemeToggle } from "../components/theme-toggle"

interface Dataset {
  _id: string
  title: string
  description: string
  category: string
  state: string
  year: number
  source: string
  files: Array<{
    fileName: string
    fileType: string
    fileSize: number
    downloadCount: number
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

export default function DataPortalPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedState, setSelectedState] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "demographics", label: "Demographics" },
    { value: "economy", label: "Economy" },
    { value: "education", label: "Education" },
    { value: "health", label: "Healthcare" },
    { value: "agriculture", label: "Agriculture" },
    { value: "infrastructure", label: "Infrastructure" }
  ]

  const states = [
    { value: "all", label: "All States" },
    { value: "all-india", label: "All India" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "delhi", label: "Delhi" },
    { value: "karnataka", label: "Karnataka" },
    { value: "tamil-nadu", label: "Tamil Nadu" },
    { value: "gujarat", label: "Gujarat" },
    { value: "west-bengal", label: "West Bengal" },
    { value: "uttar-pradesh", label: "Uttar Pradesh" },
    { value: "bihar", label: "Bihar" },
    { value: "kerala", label: "Kerala" },
    { value: "andhra-pradesh", label: "Andhra Pradesh" }
  ]

  const years = [
    { value: "all", label: "All Years" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" }
  ]

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  // Fetch datasets from API
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/datasets`)
        const data = await response.json()
        
        if (data.success) {
          setDatasets(data.data)
        } else {
          setError('Failed to fetch datasets')
        }
      } catch (error) {
        setError('Error connecting to server')
      } finally {
        setLoading(false)
      }
    }

    fetchDatasets()
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "demographics": return <Users className="w-4 h-4" />
      case "economy": return <TrendingUp className="w-4 h-4" />
      case "education": return <BookOpen className="w-4 h-4" />
      case "health": return <Shield className="w-4 h-4" />
      case "agriculture": return <Globe className="w-4 h-4" />
      case "infrastructure": return <Building2 className="w-4 h-4" />
      default: return <Database className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "demographics": return "bg-blue-100 text-blue-800"
      case "economy": return "bg-green-100 text-green-800"
      case "education": return "bg-purple-100 text-purple-800"
      case "health": return "bg-red-100 text-red-800"
      case "agriculture": return "bg-yellow-100 text-yellow-800"
      case "infrastructure": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = async (dataset: Dataset, fileIndex: number = 0) => {
    if (!isLoggedIn) {
      alert('Please login to download datasets')
      navigate('/login')
      return
    }

    try {
      const token = localStorage.getItem('token')
              const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/datasets/${dataset._id}/download/${fileIndex}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = dataset.files[fileIndex].fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Download failed. Please try again.')
      }
    } catch (error) {
      alert('Download failed. Please try again.')
    }
  }

  const handlePreview = (dataset: Dataset) => {
    // For now, just show dataset details
    alert(`Preview: ${dataset.title}\n\n${dataset.description}`)
  }

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || dataset.category === selectedCategory
    const matchesState = selectedState === "all" || dataset.state === selectedState
    const matchesYear = selectedYear === "all" || dataset.year.toString() === selectedYear

    return matchesSearch && matchesCategory && matchesState && matchesYear
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">StatsOfIndia</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Data Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Welcome, {user?.fullName}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate('/register')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                </div>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search datasets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Upload Section for Logged In Users */}
        {isLoggedIn && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload New Dataset
                </CardTitle>
                <CardDescription>
                  Share your data with the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/dashboard')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Dataset
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading datasets...</p>
            </div>
          ) : error ? (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredDatasets.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No datasets found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {datasets.length === 0 
                  ? "No datasets available yet. Upload your first dataset!"
                  : "Try adjusting your search criteria."
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDatasets.map((dataset) => (
                <Card key={dataset._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(dataset.category)}
                        <Badge className={getCategoryColor(dataset.category)}>
                          {dataset.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{dataset.statistics.rating.average.toFixed(1)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{dataset.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {dataset.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{dataset.state === 'all-india' ? 'All India' : dataset.state}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{dataset.year}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span>{dataset.files[0]?.fileType.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>{formatFileSize(dataset.files[0]?.fileSize || 0)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
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
                          className="flex-1"
                          onClick={() => handlePreview(dataset)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDownload(dataset)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 