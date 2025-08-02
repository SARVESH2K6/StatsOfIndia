"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { 
  Building2, 
  Database, 
  FileText, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  LogOut,
  User,
  Shield,
  Globe,
  BookOpen,
  Calculator
} from "lucide-react"
import { ThemeToggle } from "../components/theme-toggle"

export default function DashboardPage() {
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    console.log('Dashboard: Checking authentication...')
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")
    
    console.log('Dashboard: Token exists:', !!token)
    console.log('Dashboard: User data exists:', !!userStr)

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        console.log('Dashboard: User data:', user)
        
        if (user.role === 'admin') {
          console.log('Dashboard: User is admin, redirecting to admin dashboard')
          navigate("/admin")
          return
        }
        
        setIsAuthenticated(true)
        setUserEmail(user.email)
        setUserName(user.fullName || user.email)
        console.log('Dashboard: User authentication successful')
      } catch (error) {
        console.error("Error parsing user data:", error)
        navigate("/login")
      }
    } else {
      console.log('Dashboard: No token or user data, redirecting to login')
      navigate("/login")
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  if (!isAuthenticated) {
    return null
  }

  const dataCategories = [
    {
      id: "demographics",
      name: "Demographics",
      icon: Users,
      description: "Population, age distribution, gender ratios",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      count: "15 datasets"
    },
    {
      id: "economy",
      name: "Economy",
      icon: TrendingUp,
      description: "GDP, employment, industrial statistics",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      count: "23 datasets"
    },
    {
      id: "education",
      name: "Education",
      icon: BookOpen,
      description: "Literacy rates, school enrollment, academic performance",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      count: "12 datasets"
    },
    {
      id: "health",
      name: "Healthcare",
      icon: Shield,
      description: "Medical facilities, disease statistics, health indicators",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      count: "18 datasets"
    },
    {
      id: "agriculture",
      name: "Agriculture",
      icon: Globe,
      description: "Crop production, land use, farming statistics",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      count: "9 datasets"
    },
    {
      id: "infrastructure",
      name: "Infrastructure",
      icon: Building2,
      description: "Roads, electricity, water supply, connectivity",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      count: "14 datasets"
    }
  ]

  const recentActivities = [
    { action: "Downloaded demographic data", time: "2 hours ago", type: "download" },
    { action: "Viewed economic statistics", time: "1 day ago", type: "view" },
    { action: "Exported education dataset", time: "3 days ago", type: "export" },
    { action: "Searched for health indicators", time: "1 week ago", type: "search" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                StatsOfIndia
              </h1>
              <p className="text-sm text-muted-foreground font-medium">Official Government Data Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="w-4 h-4" />
              <span>Welcome, {userName}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Your Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Access official government data and statistics. Explore datasets, download reports, and analyze trends.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Datasets</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">91</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Downloads</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">247</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Reports</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">34</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Categories */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Data Categories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dataCategories.map((category) => (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                          <category.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {category.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {category.description}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="datasets" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Available Datasets
              </h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                        <category.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <CardDescription>{category.count}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {category.description}
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Generated Reports
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demographic Analysis 2023</CardTitle>
                  <CardDescription>Population trends and distribution analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">PDF</Badge>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Economic Indicators Report</CardTitle>
                  <CardDescription>GDP, employment, and industrial statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Excel</Badge>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'download' ? 'bg-green-100 dark:bg-green-900' :
                          activity.type === 'view' ? 'bg-blue-100 dark:bg-blue-900' :
                          activity.type === 'export' ? 'bg-purple-100 dark:bg-purple-900' :
                          'bg-gray-100 dark:bg-gray-900'
                        }`}>
                          {activity.type === 'download' ? <Download className="w-4 h-4 text-green-600 dark:text-green-400" /> :
                           activity.type === 'view' ? <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> :
                           activity.type === 'export' ? <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" /> :
                           <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 