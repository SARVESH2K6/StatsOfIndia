"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Eye, EyeOff, BarChart3, ArrowLeft } from "lucide-react"

interface LoginPageProps {
  onLoginSuccess?: (userData: any) => void
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('Login response:', data)

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        
        console.log('Stored token:', data.data.token)
        console.log('Stored user:', data.data.user)
        
        // Update parent component state
        if (onLoginSuccess) {
          onLoginSuccess(data.data.user)
        }
        
        // Redirect based on user role
        console.log('Redirecting based on role...')
        if (data.data.user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-stone-900 dark:via-neutral-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent tracking-tight">
                StatsOfIndia
              </h1>
              <p className="text-sm text-muted-foreground font-medium">Official Government Data Portal</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 bg-stone-50/80 backdrop-blur-sm dark:bg-stone-900/80">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              Secure Login
            </CardTitle>
            <CardDescription className="text-stone-600 dark:text-stone-400">
              Access your account to download datasets
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300"
                >
                  Create one here
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-700">
              <div className="text-center">
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
                  Demo Account
                </p>
                <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-3 text-xs">
                  <p className="text-stone-600 dark:text-stone-400">
                    <strong>Email:</strong> admin@statsofindia.com
                  </p>
                  <p className="text-stone-600 dark:text-stone-400">
                    <strong>Password:</strong> admin123
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 