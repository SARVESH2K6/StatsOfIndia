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
  Upload, 
  Database, 
  FileText, 
  Users, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  LogOut,
  User,
  Shield,
  Globe,
  BookOpen,
  Calculator,
  Plus,
  Trash2,
  Eye,
  Settings,
  BarChart3
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
  dataQuality: string
  tags: string[]
  files: Array<{
    fileName: string
    fileType: string
    fileSize: number
    downloadCount: number
  }>
  statistics: {
    downloadCount: number
    viewCount: number
    rating: { average: number; count: number }
  }
  isPublic: boolean
  isActive: boolean
  createdAt: string
}

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "",
    state: "all-india",
    year: new Date().getFullYear(),
    source: "",
    sourceUrl: "",
    tags: "",
    isPublic: true
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    console.log('Admin Dashboard: Checking authentication...')
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")
    
    console.log('Admin Dashboard: Token exists:', !!token)
    console.log('Admin Dashboard: User data exists:', !!userStr)

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        console.log('Admin Dashboard: User data:', user)
        
        if (user.role === 'admin') {
          setIsAuthenticated(true)
          setIsAdmin(true)
          setUserEmail(user.email)
          setUserName(user.fullName || user.email)
          console.log('Admin Dashboard: Admin authentication successful')
          fetchDatasets()
        } else {
          console.log('Admin Dashboard: User is not admin, redirecting to dashboard')
          navigate("/dashboard")
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        navigate("/login")
      }
    } else {
      console.log('Admin Dashboard: No token or user data, redirecting to login')
      navigate("/login")
    }
  }, [navigate])

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUploadFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setUploadForm({
      ...uploadForm,
      [e.target.name]: e.target.value
    })
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setError('Please select a file')
      return
    }

    try {
      setUploading(true)
      setError("")
      setSuccess("")

      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', uploadForm.title)
      formData.append('description', uploadForm.description)
      formData.append('category', uploadForm.category)
      formData.append('state', uploadForm.state)
      formData.append('year', uploadForm.year.toString())
      formData.append('source', uploadForm.source)
      formData.append('sourceUrl', uploadForm.sourceUrl)
      formData.append('tags', uploadForm.tags)
      formData.append('isPublic', uploadForm.isPublic.toString())

      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/datasets/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Dataset uploaded successfully!')
        setUploadForm({
          title: "",
          description: "",
          category: "",
          state: "all-india",
          year: new Date().getFullYear(),
          source: "",
          sourceUrl: "",
          tags: "",
          isPublic: true
        })
        setSelectedFile(null)
        fetchDatasets() // Refresh the list
      } else {
        setError(data.message || 'Upload failed')
      }
    } catch (error) {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  const handleDeleteDataset = async (datasetId: string) => {
    if (!confirm('Are you sure you want to delete this dataset?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/datasets/${datasetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Dataset deleted successfully!')
        fetchDatasets() // Refresh the list
      } else {
        setError(data.message || 'Delete failed')
      }
    } catch (error) {
      setError('Delete failed. Please try again.')
    }
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  const dataCategories = [
    { id: "demographics", name: "Demographics", icon: Users, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    { id: "economy", name: "Economy", icon: Calculator, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    { id: "education", name: "Education", icon: BookOpen, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
    { id: "health", name: "Healthcare", icon: Shield, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
    { id: "agriculture", name: "Agriculture", icon: Globe, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="manage">Manage Datasets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{datasets.length}</div>
                  <p className="text-xs text-muted-foreground">Available datasets</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {datasets.reduce((sum, dataset) => sum + dataset.statistics.downloadCount, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Dataset downloads</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Data Categories</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dataCategories.length}</div>
                  <p className="text-xs text-muted-foreground">Available categories</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Uploads</CardTitle>
                  <CardDescription>Latest datasets added to the system</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : (
                    <div className="space-y-4">
                      {datasets.slice(0, 5).map((dataset) => (
                        <div key={dataset._id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{dataset.title}</h4>
                            <p className="text-sm text-gray-500">{dataset.category}</p>
                          </div>
                          <Badge variant="outline">{dataset.dataQuality}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => navigate('/admin/upload')} className="h-20">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Dataset
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/data-portal')} className="h-20">
                      <Eye className="w-5 h-5 mr-2" />
                      View Portal
                    </Button>
                    <Button variant="outline" className="h-20">
                      <Users className="w-5 h-5 mr-2" />
                      Manage Users
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

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Dataset</CardTitle>
                <CardDescription>Add new CSV or PDF files to the database</CardDescription>
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

                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Dataset Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={uploadForm.title}
                        onChange={handleUploadFormChange}
                        placeholder="Enter dataset title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        name="category"
                        value={uploadForm.category}
                        onChange={handleUploadFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select category</option>
                        {dataCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State/Region</Label>
                      <select
                        id="state"
                        name="state"
                        value={uploadForm.state}
                        onChange={handleUploadFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all-india">All India</option>
                        <option value="andhra-pradesh">Andhra Pradesh</option>
                        <option value="arunachal-pradesh">Arunachal Pradesh</option>
                        <option value="assam">Assam</option>
                        <option value="bihar">Bihar</option>
                        <option value="chhattisgarh">Chhattisgarh</option>
                        <option value="goa">Goa</option>
                        <option value="gujarat">Gujarat</option>
                        <option value="haryana">Haryana</option>
                        <option value="himachal-pradesh">Himachal Pradesh</option>
                        <option value="jharkhand">Jharkhand</option>
                        <option value="karnataka">Karnataka</option>
                        <option value="kerala">Kerala</option>
                        <option value="madhya-pradesh">Madhya Pradesh</option>
                        <option value="maharashtra">Maharashtra</option>
                        <option value="manipur">Manipur</option>
                        <option value="meghalaya">Meghalaya</option>
                        <option value="mizoram">Mizoram</option>
                        <option value="nagaland">Nagaland</option>
                        <option value="odisha">Odisha</option>
                        <option value="punjab">Punjab</option>
                        <option value="rajasthan">Rajasthan</option>
                        <option value="sikkim">Sikkim</option>
                        <option value="tamil-nadu">Tamil Nadu</option>
                        <option value="telangana">Telangana</option>
                        <option value="tripura">Tripura</option>
                        <option value="uttar-pradesh">Uttar Pradesh</option>
                        <option value="uttarakhand">Uttarakhand</option>
                        <option value="west-bengal">West Bengal</option>
                        <option value="delhi">Delhi</option>
                        <option value="jammu-kashmir">Jammu & Kashmir</option>
                        <option value="ladakh">Ladakh</option>
                        <option value="chandigarh">Chandigarh</option>
                        <option value="dadra-nagar-haveli">Dadra & Nagar Haveli</option>
                        <option value="daman-diu">Daman & Diu</option>
                        <option value="lakshadweep">Lakshadweep</option>
                        <option value="puducherry">Puducherry</option>
                        <option value="andaman-nicobar">Andaman & Nicobar Islands</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        name="year"
                        type="number"
                        value={uploadForm.year}
                        onChange={handleUploadFormChange}
                        min="1900"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="source">Data Source</Label>
                      <Input
                        id="source"
                        name="source"
                        value={uploadForm.source}
                        onChange={handleUploadFormChange}
                        placeholder="e.g., Government of India"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sourceUrl">Source URL</Label>
                      <Input
                        id="sourceUrl"
                        name="sourceUrl"
                        type="url"
                        value={uploadForm.sourceUrl}
                        onChange={handleUploadFormChange}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={uploadForm.description}
                      onChange={handleUploadFormChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the dataset content..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={uploadForm.tags}
                      onChange={handleUploadFormChange}
                      placeholder="e.g., population, census, demographics"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Select File *</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".csv,.pdf"
                      onChange={handleFileChange}
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Supported formats: CSV, PDF (Max size: 50MB)
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="isPublic"
                      name="isPublic"
                      type="checkbox"
                      checked={uploadForm.isPublic}
                      onChange={(e) => setUploadForm({...uploadForm, isPublic: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="isPublic">Make dataset publicly available</Label>
                  </div>

                  <Button type="submit" disabled={uploading} className="w-full">
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Dataset
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Datasets Tab */}
          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Datasets</CardTitle>
                <CardDescription>View, edit, and delete datasets</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading datasets...</div>
                ) : (
                  <div className="space-y-4">
                    {datasets.map((dataset) => (
                      <div key={dataset._id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{dataset.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                              {dataset.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="outline">{dataset.category}</Badge>
                              <Badge variant="outline">{dataset.state}</Badge>
                              <Badge variant="outline">{dataset.year}</Badge>
                              <Badge variant={dataset.isPublic ? "default" : "secondary"}>
                                {dataset.isPublic ? "Public" : "Private"}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>Downloads: {dataset.statistics.downloadCount}</span>
                              <span>Views: {dataset.statistics.viewCount}</span>
                              <span>Files: {dataset.files.length}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteDataset(dataset._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Download Analytics</CardTitle>
                  <CardDescription>Dataset download statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Analytics dashboard coming soon...</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>User engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">User activity tracking coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
} 