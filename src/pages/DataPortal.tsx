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
  LogIn,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Info,
  ExternalLink,
  Settings
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
  sourceUrl?: string
  tags: string[]
  files: Array<{
    _id: string
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
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [bookmarkedDatasets, setBookmarkedDatasets] = useState<string[]>([])
  const [userPreferences, setUserPreferences] = useState<string[]>([])

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
    { value: "andhra-pradesh", label: "Andhra Pradesh" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "madhya-pradesh", label: "Madhya Pradesh" },
    { value: "telangana", label: "Telangana" },
    { value: "odisha", label: "Odisha" },
    { value: "punjab", label: "Punjab" },
    { value: "haryana", label: "Haryana" },
    { value: "jharkhand", label: "Jharkhand" },
    { value: "chhattisgarh", label: "Chhattisgarh" },
    { value: "assam", label: "Assam" },
    { value: "himachal-pradesh", label: "Himachal Pradesh" },
    { value: "uttarakhand", label: "Uttarakhand" },
    { value: "goa", label: "Goa" },
    { value: "sikkim", label: "Sikkim" },
    { value: "manipur", label: "Manipur" },
    { value: "meghalaya", label: "Meghalaya" },
    { value: "mizoram", label: "Mizoram" },
    { value: "nagaland", label: "Nagaland" },
    { value: "tripura", label: "Tripura" },
    { value: "arunachal-pradesh", label: "Arunachal Pradesh" }
  ]

  const years = [
    { value: "all", label: "All Years" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" },
    { value: "2019", label: "2019" },
    { value: "2018", label: "2018" },
    { value: "2017", label: "2017" },
    { value: "2016", label: "2016" },
    { value: "2015", label: "2015" }
  ]

  const sortOptions = [
    { value: "createdAt", label: "Date Added" },
    { value: "title", label: "Title" },
    { value: "year", label: "Year" },
    { value: "statistics.downloadCount", label: "Downloads" },
    { value: "statistics.viewCount", label: "Views" },
    { value: "statistics.rating.average", label: "Rating" }
  ]

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
      fetchBookmarkedDatasets()
      fetchUserPreferences()
    }
  }, [])

  // Fetch datasets from API
  useEffect(() => {
    fetchDatasets()
  }, [])

  const fetchBookmarkedDatasets = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        const bookmarkedIds = data.data.bookmarks.map((bookmark: any) => bookmark.datasetId)
        setBookmarkedDatasets(bookmarkedIds)
      }
    } catch (error) {
      console.error('Error fetching bookmarked datasets:', error)
    }
  }

  const fetchUserPreferences = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setUserPreferences(data.data.preferences?.dataCategories || [])
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error)
    }
  }

  const handleBookmark = async (dataset: Dataset) => {
    if (!isLoggedIn) {
      alert('Please login to bookmark datasets')
      navigate('/login')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const isBookmarked = bookmarkedDatasets.includes(dataset._id)
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/datasets/${dataset._id}/bookmark`, {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        if (isBookmarked) {
          setBookmarkedDatasets(bookmarkedDatasets.filter(id => id !== dataset._id))
        } else {
          setBookmarkedDatasets([...bookmarkedDatasets, dataset._id])
        }
      } else {
        alert(data.message || 'Bookmark operation failed')
      }
    } catch (error) {
      alert('Bookmark operation failed')
    }
  }

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      fetchDatasets()
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/datasets/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setDatasets(data.data)
        // Save search to history if user is logged in
        if (isLoggedIn && token) {
          try {
            await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/search-history`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                query: searchQuery,
                timestamp: new Date().toISOString()
              })
            })
          } catch (error) {
            console.error('Failed to save search history:', error)
          }
        }
      } else {
        setError('Search failed')
      }
    } catch (error) {
      setError('Error performing search')
    } finally {
      setLoading(false)
    }
  }

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

  const handleDownload = async (dataset: Dataset, fileIndex: number = 0) => {
    if (!isLoggedIn) {
      alert('Please login to download datasets')
      navigate('/login')
      return
    }

    try {
      const file = dataset.files[fileIndex]
      if (!file) {
        alert('File not found')
        return
      }

      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/datasets/${dataset._id}/download/${file._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.fileName
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

  const handleViewDetails = (dataset: Dataset) => {
    navigate(`/dataset/${dataset._id}`)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedState("all")
    setSelectedYear("all")
  }

  const filteredAndSortedDatasets = datasets
    .filter(dataset => {
      const matchesSearch = dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || dataset.category === selectedCategory
      const matchesState = selectedState === "all" || dataset.state === selectedState
      const matchesYear = selectedYear === "all" || dataset.year.toString() === selectedYear

      return matchesSearch && matchesCategory && matchesState && matchesYear
    })
    .sort((a, b) => {
      // First, prioritize preferred categories
      const aIsPreferred = userPreferences.includes(a.category)
      const bIsPreferred = userPreferences.includes(b.category)
      
      if (aIsPreferred && !bIsPreferred) return -1
      if (!aIsPreferred && bIsPreferred) return 1
      
      // Then apply the selected sort order
      let aValue: any, bValue: any

      switch (sortBy) {
        case "statistics.downloadCount":
          aValue = a.statistics.downloadCount
          bValue = b.statistics.downloadCount
          break
        case "statistics.viewCount":
          aValue = a.statistics.viewCount
          bValue = b.statistics.viewCount
          break
        case "statistics.rating.average":
          aValue = a.statistics.rating.average
          bValue = b.statistics.rating.average
          break
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "year":
          aValue = a.year
          bValue = b.year
          break
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const activeFilters = [
    selectedCategory !== "all" && `Category: ${categories.find(c => c.value === selectedCategory)?.label}`,
    selectedState !== "all" && `State: ${states.find(s => s.value === selectedState)?.label}`,
    selectedYear !== "all" && `Year: ${selectedYear}`,
    searchQuery && `Search: "${searchQuery}"`
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-stone-900 dark:to-neutral-800">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative flex">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search datasets by title, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery)
                    }
                  }}
                  className="pl-10 pr-20"
                />
                <Button
                  size="sm"
                  onClick={() => handleSearch(searchQuery)}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3"
                >
                  Search
                </Button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  <SelectTrigger>
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

              {activeFilters.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                  {activeFilters.map((filter, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {filter}
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Preferences Section */}
        {isLoggedIn && (
          <div className="mb-8">
            {userPreferences.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-500" />
                      Your Preferred Categories
                    </div>
                                      <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Preferences
                  </Button>
                  </CardTitle>
                  <CardDescription>
                    Datasets from your preferred categories are shown first
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userPreferences.map((category) => {
                      const categoryInfo = categories.find(c => c.value === category)
                      return (
                        <Badge key={category} className={getCategoryColor(category)}>
                          {categoryInfo?.label || category}
                        </Badge>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-blue-500" />
                      Personalize Your Experience
                    </div>
                                      <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Set Preferences
                  </Button>
                  </CardTitle>
                  <CardDescription>
                    Set your preferred data categories to see relevant datasets first
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose your preferred data categories in settings to prioritize relevant datasets in your browse experience.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Upload Section for Admin Users Only */}
        {isLoggedIn && user?.role === 'admin' && (
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

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedDatasets.length} of {datasets.length} datasets
          </div>
          {activeFilters.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Filtered by: {activeFilters.join(", ")}
            </div>
          )}
        </div>

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
          ) : filteredAndSortedDatasets.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No datasets found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {datasets.length === 0 
                  ? "No datasets available yet. Upload your first dataset!"
                  : "Try adjusting your search criteria."
                }
              </p>
              {activeFilters.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
              : "space-y-4"
            }>
              {filteredAndSortedDatasets.map((dataset) => (
                <Card key={dataset._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(dataset.category)}
                        <Badge className={getCategoryColor(dataset.category)}>
                          {dataset.category}
                        </Badge>
                        {userPreferences.includes(dataset.category) && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 min-w-0">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                        <span className="truncate">{dataset.statistics.rating.average.toFixed(1)}</span>
                        <span className="text-xs truncate">({dataset.statistics.rating.count})</span>
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

                      {dataset.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {dataset.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {dataset.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{dataset.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 min-w-0"
                          onClick={() => handleViewDetails(dataset)}
                        >
                          <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Details</span>
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 min-w-0"
                          onClick={() => handleDownload(dataset)}
                        >
                          <Download className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Download</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-10 h-9 flex-shrink-0"
                          onClick={() => handleBookmark(dataset)}
                        >
                          {bookmarkedDatasets.includes(dataset._id) ? (
                            <Star className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <Star className="w-4 h-4 text-gray-400" />
                          )}
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