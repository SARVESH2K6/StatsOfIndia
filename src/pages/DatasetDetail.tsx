"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Alert, AlertDescription } from "../components/ui/alert"
import { 
  ArrowLeft,
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
  ExternalLink,
  Info,
  Database,
  Clock,
  User,
  Tag,
  Link,
  FileDown,
  Share2,
  Bookmark,
  BookmarkPlus
} from "lucide-react"
import { ThemeToggle } from "../components/theme-toggle"

interface Dataset {
  _id: string
  title: string
  description: string
  category: string
  subcategory?: string
  state: string
  year: number
  source: string
  sourceUrl?: string
  tags: string[]
  dataQuality: string
  metadata: {
    totalRecords: number
    fileSize: number
    lastUpdated: string
    updateFrequency: string
    coverage: string
    timeSeries: boolean
    timeRange: {
      start: number
      end: number
    }
  }
  files: Array<{
    _id: string
    fileName: string
    originalName: string
    fileType: string
    fileSize: number
    downloadCount: number
    uploadedAt: string
  }>
  statistics: {
    downloadCount: number
    viewCount: number
    rating: {
      average: number
      count: number
    }
    lastDownloaded: string | null
  }
  createdBy?: {
    _id: string
    fullName: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export default function DatasetDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
      
      // Check if dataset is bookmarked
      checkIfBookmarked()
    }
  }, [])

  // Fetch dataset details
  useEffect(() => {
    const fetchDataset = async () => {
      if (!id) return

      try {
        setLoading(true)
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/datasets/${id}`)
        const data = await response.json()
        
        if (data.success) {
          setDataset(data.data)
        } else {
          setError('Failed to fetch dataset details')
        }
      } catch (error) {
        setError('Error connecting to server')
      } finally {
        setLoading(false)
      }
    }

    fetchDataset()
  }, [id])

  const checkIfBookmarked = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        const isBookmarked = data.data.bookmarks.some((bookmark: any) => bookmark.datasetId === id)
        setIsBookmarked(isBookmarked)
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error)
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

  const getDataQualityColor = (quality: string) => {
    switch (quality) {
      case "verified": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "unverified": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDownload = async (fileId: string, fileName: string) => {
    if (!isLoggedIn) {
      alert('Please login to download files')
      navigate('/login')
      return
    }

    try {
      setDownloading(fileId)
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/datasets/${id}/download/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Download failed. Please try again.')
      }
    } catch (error) {
      alert('Download failed. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: dataset?.title,
        text: dataset?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      alert('Please login to bookmark datasets')
      navigate('/login')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/datasets/${id}/bookmark`, {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setIsBookmarked(!isBookmarked)
        alert(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks')
      } else {
        alert(data.message || 'Bookmark operation failed')
      }
    } catch (error) {
      alert('Bookmark operation failed')
    }
  }

  const handleRemoveBookmark = async () => {
    if (!isLoggedIn) {
      alert('Please login to manage bookmarks')
      navigate('/login')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/datasets/${id}/bookmark`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setIsBookmarked(false)
        alert('Removed from bookmarks')
      } else {
        alert(data.message || 'Remove bookmark failed')
      }
    } catch (error) {
      alert('Remove bookmark failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dataset details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !dataset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert>
            <AlertDescription>{error || 'Dataset not found'}</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/data-portal')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Data Portal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dataset Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(dataset.category)}
                    <Badge className={getCategoryColor(dataset.category)}>
                      {dataset.category}
                    </Badge>
                    <Badge className={getDataQualityColor(dataset.dataQuality)}>
                      {dataset.dataQuality}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{dataset.statistics.rating.average.toFixed(1)}</span>
                    <span className="text-xs">({dataset.statistics.rating.count} reviews)</span>
                  </div>
                </div>
                <CardTitle className="text-2xl">{dataset.title}</CardTitle>
                <CardDescription className="text-base">
                  {dataset.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Dataset Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Dataset Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">State/Region</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dataset.state === 'all-india' ? 'All India' : dataset.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Year</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{dataset.year}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Link className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Data Source</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{dataset.source}</p>
                        {dataset.sourceUrl && (
                          <a 
                            href={dataset.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Visit source
                          </a>
                        )}
                      </div>
                    </div>

                    {dataset.subcategory && (
                      <div className="flex items-center space-x-3">
                        <Tag className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Subcategory</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{dataset.subcategory}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Total Records</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dataset.metadata.totalRecords.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">File Size</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatFileSize(dataset.metadata.fileSize)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(dataset.metadata.lastUpdated)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Update Frequency</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {dataset.metadata.updateFrequency}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {dataset.tags.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {dataset.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Files */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileDown className="w-5 h-5 mr-2" />
                  Available Files
                </CardTitle>
                <CardDescription>
                  Download individual files from this dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataset.files.map((file, index) => (
                    <div key={file._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">{file.originalName}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{file.fileType.toUpperCase()}</span>
                            <span>{formatFileSize(file.fileSize)}</span>
                            <span>{file.downloadCount} downloads</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownload(file._id, file.originalName)}
                        disabled={downloading === file._id}
                      >
                        {downloading === file._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Downloads</span>
                    <span className="font-medium">{dataset.statistics.downloadCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Views</span>
                    <span className="font-medium">{dataset.statistics.viewCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{dataset.statistics.rating.average.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Files Available</span>
                    <span className="font-medium">{dataset.files.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Metadata
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Coverage</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{dataset.metadata.coverage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Time Series</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {dataset.metadata.timeSeries ? 'Yes' : 'No'}
                    </p>
                  </div>
                  {dataset.metadata.timeSeries && (
                    <div>
                      <p className="text-sm font-medium">Time Range</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {dataset.metadata.timeRange.start} - {dataset.metadata.timeRange.end}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(dataset.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(dataset.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => handleDownload(dataset.files[0]._id, dataset.files[0].originalName)}
                    disabled={downloading === dataset.files[0]._id}
                  >
                    {downloading === dataset.files[0]._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download All Files
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Dataset
                  </Button>
                  <div className="space-y-2">
                    {isBookmarked ? (
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={handleRemoveBookmark}
                      >
                        <Bookmark className="w-4 h-4 mr-2 fill-current" />
                        Remove Bookmark
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={handleBookmark}
                      >
                        <BookmarkPlus className="w-4 h-4 mr-2" />
                        Add Bookmark
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 