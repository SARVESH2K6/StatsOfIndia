"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../components/ui/carousel"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  BookOpen, 
  Globe2, 
  Twitter, 
  Linkedin, 
  Github,
  Building2,
  Database,
  Shield,
  Globe,
  BookOpen as BookOpenIcon,
  Calculator,
  LogIn,
  UserPlus
} from "lucide-react"
import { ThemeToggle } from "../components/theme-toggle"
import { useStates, useTopics, useTopStates, useRandomFunFact } from "../hooks/useData"

const topics = [
  { id: "demographics", name: "Demographics", icon: Users, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  { id: "education", name: "Education", icon: BookOpenIcon, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  { id: "economy", name: "Economy", icon: TrendingUp, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { id: "health", name: "Healthcare", icon: Shield, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  { id: "agriculture", name: "Agriculture", icon: Globe, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  { id: "infrastructure", name: "Infrastructure", icon: Building2, color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
]

const states = [
  "All India",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

const timeRanges = ["2023-2024", "2022-2023", "2021-2022", "2020-2021", "2019-2020", "Last 5 Years", "Last 10 Years"]

export default function HomePage() {
  const navigate = useNavigate()
  const [selectedTopic, setSelectedTopic] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedTimeRange, setSelectedTimeRange] = useState("")

  // Fetch data from API
  const { states: apiStates } = useStates()
  const { topics: apiTopics } = useTopics()
  const { funFact } = useRandomFunFact() // This will change on every page refresh

  const handleViewStatistics = () => {
    const params = new URLSearchParams()
    if (selectedTopic) params.set("topic", selectedTopic)
    if (selectedState) params.set("state", selectedState)
    if (selectedTimeRange) params.set("period", selectedTimeRange)

    navigate(`/statistics?${params.toString()}`)
  }

  const isFormValid = selectedTopic && selectedState && selectedTimeRange

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
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                StatsOfIndia
              </h1>
              <p className="text-sm text-muted-foreground font-medium">Official Government Data Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16" id="hero">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> StatsOfIndia</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Access comprehensive statistics and data from verified government sources. 
            Explore demographics, economy, education, healthcare, and more across all Indian states.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/data-portal">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Database className="w-5 h-5 mr-2" />
                Browse Datasets
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline">
                <UserPlus className="w-5 h-5 mr-2" />
                Get Full Access
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">91</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Datasets</div>
            </div>
            <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">28</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">States & UTs</div>
            </div>
            <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">6</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
            </div>
            <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Categories Section */}
      <section className="container mx-auto px-4 py-16" id="categories">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Data Categories
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore official government data across multiple categories. Each dataset is verified and sourced from authorized government departments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Card key={topic.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/90 dark:bg-gray-900/90">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${topic.color}`}>
                    <topic.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">{topic.name}</h4>
                    <Badge variant="secondary" className="px-3 py-1 rounded-full text-xs font-bold shadow group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      Official Data
                    </Badge>
                  </div>
                </div>
                <p className="text-base text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-300">
                  Comprehensive statistics and trends for {topic.name.toLowerCase()} across all Indian states.
                </p>
                <span className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary font-bold text-lg">→</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16" id="features">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose StatsOfIndia?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Official government data portal with verified information from authorized sources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Official & Verified</h4>
            <p className="text-gray-600 dark:text-gray-400">
              All data is sourced from verified government departments and agencies with official authorization.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Comprehensive Coverage</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Access data from all 28 states and 8 union territories across multiple categories and time periods.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Access</h4>
            <p className="text-gray-600 dark:text-gray-400">
              User-friendly interface with search, filter, and download capabilities for all datasets.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Access Official Data?</h3>
          <p className="text-xl mb-8 opacity-90">
            Register now to get full access to all government datasets and advanced features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </Button>
            </Link>
            <Link to="/data-portal">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Database className="w-5 h-5 mr-2" />
                Browse Datasets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">StatsOfIndia</h4>
              <p className="text-gray-400 text-sm">
                Official statistics and data from the Government of India. 
                Verified information from authorized government departments.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/data-portal" className="hover:text-white">Browse Datasets</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
                <li><Link to="/statistics" className="hover:text-white">Statistics</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Data Categories</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Demographics</li>
                <li>Economy</li>
                <li>Education</li>
                <li>Healthcare</li>
                <li>Agriculture</li>
                <li>Infrastructure</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Government of India</p>
                <p>Official Data Portal</p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="hover:text-white"><Twitter className="w-5 h-5" /></a>
                  <a href="#" className="hover:text-white"><Linkedin className="w-5 h-5" /></a>
                  <a href="#" className="hover:text-white"><Github className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 StatsOfIndia. All rights reserved. Official portal of the Government of India.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
