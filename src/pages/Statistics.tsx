"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Download, FileText, Building2, Database } from "lucide-react"
import { ThemeToggle } from "../components/theme-toggle"

function StatisticsContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  
  // Get initial values from URL params or homepage selections
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get("topic") || "education")
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "all-india")
  const [selectedYear, setSelectedYear] = useState(parseInt(searchParams.get("year") || "2023"))
  const [loading, setLoading] = useState(false)

  // Update URL when selections change
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedTopic) params.set("topic", selectedTopic)
    if (selectedState) params.set("state", selectedState)
    if (selectedYear) params.set("year", selectedYear.toString())
    
    navigate(`/statistics?${params.toString()}`, { replace: true })
  }, [selectedTopic, selectedState, selectedYear, navigate])

  const handleBackToHome = () => {
    navigate("/")
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-600" />
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-600" />
  }

  // Mock data for demonstration
  const mockData = {
    education: [
      { state: "Maharashtra", literacyRate: 82.34, enrollmentRate: 95.2, dropoutRate: 4.8, trend: "up" },
      { state: "Kerala", literacyRate: 94.0, enrollmentRate: 98.1, dropoutRate: 1.9, trend: "up" },
      { state: "Tamil Nadu", literacyRate: 80.09, enrollmentRate: 93.7, dropoutRate: 6.3, trend: "up" },
      { state: "Delhi", literacyRate: 86.21, enrollmentRate: 96.8, dropoutRate: 3.2, trend: "up" },
      { state: "Karnataka", literacyRate: 75.36, enrollmentRate: 91.5, dropoutRate: 8.5, trend: "down" }
    ],
    economy: [
      { state: "Maharashtra", gdpGrowth: 7.2, perCapitaIncome: 215000, unemploymentRate: 4.1, trend: "up" },
      { state: "Gujarat", gdpGrowth: 8.1, perCapitaIncome: 198000, unemploymentRate: 3.8, trend: "up" },
      { state: "Tamil Nadu", gdpGrowth: 6.9, perCapitaIncome: 185000, unemploymentRate: 4.5, trend: "up" },
      { state: "Karnataka", gdpGrowth: 7.8, perCapitaIncome: 205000, unemploymentRate: 3.9, trend: "up" },
      { state: "Delhi", gdpGrowth: 6.5, perCapitaIncome: 350000, unemploymentRate: 5.2, trend: "down" }
    ],
    health: [
      { state: "Kerala", lifeExpectancy: 75.2, infantMortality: 12, hospitalBeds: 87, trend: "up" },
      { state: "Maharashtra", lifeExpectancy: 71.8, infantMortality: 24, hospitalBeds: 45, trend: "up" },
      { state: "Tamil Nadu", lifeExpectancy: 70.4, infantMortality: 28, hospitalBeds: 52, trend: "up" },
      { state: "Delhi", lifeExpectancy: 72.1, infantMortality: 22, hospitalBeds: 78, trend: "up" },
      { state: "Bihar", lifeExpectancy: 67.9, infantMortality: 38, hospitalBeds: 12, trend: "down" }
    ]
  }

  const currentData = mockData[selectedTopic as keyof typeof mockData] || mockData.education

  const getTopicTitle = (topic: string): string => {
    switch (topic) {
      case "education": return "Education Statistics"
      case "economy": return "Economic Indicators"
      case "health": return "Healthcare Statistics"
      default: return "Statistics"
    }
  }

  const getTopicDescription = (topic: string): string => {
    switch (topic) {
      case "education": return "Literacy rates, enrollment statistics, and educational performance metrics"
      case "economy": return "GDP growth, per capita income, and employment statistics"
      case "health": return "Life expectancy, healthcare facilities, and mortality rates"
      default: return "Comprehensive statistical data"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToHome}
                className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Government Statistics
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Official data from verified government sources
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Database className="w-4 h-4" />
                <span>Official Data</span>
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Data Filters</span>
            </CardTitle>
            <CardDescription>
              Select topic, state, and year to view specific statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Topic</label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="health">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-india">All India</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Year</label>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>{getTopicTitle(selectedTopic)}</CardTitle>
              <CardDescription>{getTopicDescription(selectedTopic)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Data Source</span>
                  <Badge variant="outline">Government of India</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="text-sm font-medium">January 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Data Quality</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Verified
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Download and export options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
                <Button className="w-full" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button className="w-full" variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  View Raw Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Statistical Data</CardTitle>
            <CardDescription>
              Official government statistics for {selectedTopic} across different states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>State</TableHead>
                  {selectedTopic === "education" && (
                    <>
                      <TableHead>Literacy Rate (%)</TableHead>
                      <TableHead>Enrollment Rate (%)</TableHead>
                      <TableHead>Dropout Rate (%)</TableHead>
                    </>
                  )}
                  {selectedTopic === "economy" && (
                    <>
                      <TableHead>GDP Growth (%)</TableHead>
                      <TableHead>Per Capita Income (₹)</TableHead>
                      <TableHead>Unemployment Rate (%)</TableHead>
                    </>
                  )}
                  {selectedTopic === "health" && (
                    <>
                      <TableHead>Life Expectancy</TableHead>
                      <TableHead>Infant Mortality</TableHead>
                      <TableHead>Hospital Beds/1000</TableHead>
                    </>
                  )}
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.state}</TableCell>
                    {selectedTopic === "education" && (
                      <>
                        <TableCell>{row.literacyRate}%</TableCell>
                        <TableCell>{row.enrollmentRate}%</TableCell>
                        <TableCell>{row.dropoutRate}%</TableCell>
                      </>
                    )}
                    {selectedTopic === "economy" && (
                      <>
                        <TableCell>{row.gdpGrowth}%</TableCell>
                        <TableCell>₹{row.perCapitaIncome.toLocaleString()}</TableCell>
                        <TableCell>{row.unemploymentRate}%</TableCell>
                      </>
                    )}
                    {selectedTopic === "health" && (
                      <>
                        <TableCell>{row.lifeExpectancy} years</TableCell>
                        <TableCell>{row.infantMortality}/1000</TableCell>
                        <TableCell>{row.hospitalBeds}</TableCell>
                      </>
                    )}
                    <TableCell>
                      {getTrendIcon(row.trend)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <StatisticsContent />
    </div>
  )
}
