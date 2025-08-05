"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Eye, EyeOff, BarChart3, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { Checkbox } from "../components/ui/checkbox"
import OTPVerification from "../components/OTPVerification"

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  organization?: string
  password?: string
  confirmPassword?: string
  general?: string
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showOTPVerification, setShowOTPVerification] = useState(false)
  const [verificationData, setVerificationData] = useState({ userId: "", email: "" })
  const [tempUserData, setTempUserData] = useState(null)

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required'
        if (value.trim().length < 2) return 'Full name must be at least 2 characters'
        if (value.trim().length > 100) return 'Full name cannot exceed 100 characters'
        return ''
      
      case 'email':
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return ''
      
      case 'phone':
        if (value.trim() && !/^[0-9+\-\s()]*$/.test(value)) {
          return 'Please enter a valid phone number'
        }
        return ''
      
      case 'organization':
        if (value.trim() && value.trim().length > 200) {
          return 'Organization name cannot exceed 200 characters'
        }
        return ''
      
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters long'
        return ''
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== formData.password) return 'Passwords do not match'
        return ''
      
      default:
        return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) {
        newErrors[key as keyof FormErrors] = error
      }
    })

    // Check terms acceptance
    if (!acceptTerms) {
      newErrors.general = 'Please accept the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess("")

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/register`;
      // Making registration request
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization,
          password: formData.password
        }),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      });
      
      clearTimeout(timeoutId);

      const data = await response.json()

      if (data.success) {
        if (data.data.requiresVerification) {
          // New flow: Store temp data and show OTP verification
          setTempUserData(data.data.tempUserData)
          setVerificationData({
            userId: "",
            email: data.data.email
          })
          setShowOTPVerification(true)
        } else {
          // Legacy flow: User already has userId
          setVerificationData({
            userId: data.data.userId,
            email: data.data.email
          })
          setShowOTPVerification(true)
        }
      } else {
        // Handle specific backend errors
        if (data.message.includes('already exists')) {
          setErrors({ email: 'An account with this email already exists' })
        } else if (data.message.includes('validation')) {
          // Parse validation errors from backend
          if (data.errors) {
            const backendErrors: FormErrors = {}
            data.errors.forEach((error: any) => {
              backendErrors[error.path as keyof FormErrors] = error.msg
            })
            setErrors(backendErrors)
          } else {
            setErrors({ general: data.message })
          }
        } else {
          setErrors({ general: data.message || 'Registration failed' })
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      
      // Provide more specific error messages
      if (error instanceof TypeError && (error as Error).message.includes('fetch')) {
        setErrors({ 
          general: 'Network error: Unable to reach the server. Please check your internet connection.' 
        })
      } else if (error instanceof Error && error.message.includes('Failed to fetch')) {
        setErrors({ 
          general: 'Connection failed. Please ensure the server is running and try again.' 
        })
      } else if (error instanceof Error && error.name === 'AbortError') {
        setErrors({ 
          general: 'Request timed out. Please try again.' 
        })
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        setErrors({ 
          general: `Registration failed: ${errorMessage}` 
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationSuccess = (userData: any, token: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    navigate('/dashboard')
  }

  const handleBackToRegister = () => {
    setShowOTPVerification(false)
    setVerificationData({ userId: "", email: "" })
    setTempUserData(null)
    setErrors({})
    setSuccess("")
  }

  if (showOTPVerification) {
    return (
      <OTPVerification
        userId={verificationData.userId}
        email={verificationData.email}
        tempUserData={tempUserData}
        onVerificationSuccess={handleVerificationSuccess}
        onBack={handleBackToRegister}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-stone-900 dark:via-neutral-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent tracking-tight">
                StatsOfIndia
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Join the Data Revolution</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="shadow-xl border-0 bg-stone-50/80 backdrop-blur-sm dark:bg-stone-800/80">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-stone-600 dark:text-stone-400 text-sm">
              Join thousands of users accessing India's official statistics
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* General Error */}
            {errors.general && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full Name */}
              <div className="space-y-1">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name *
                </Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`pr-10 ${errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  {errors.fullName ? (
                    <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                  ) : formData.fullName && !errors.fullName ? (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                  ) : null}
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address *
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`pr-10 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  {errors.email ? (
                    <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                  ) : formData.email && !errors.email ? (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                  ) : null}
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone & Organization in one row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Phone (optional)"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pr-10 ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.phone ? (
                      <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                    ) : formData.phone && !errors.phone ? (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                    ) : null}
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center">
                      <XCircle className="w-3 h-3 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="organization" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Organization
                  </Label>
                  <div className="relative">
                    <Input
                      id="organization"
                      name="organization"
                      type="text"
                      placeholder="Org (optional)"
                      value={formData.organization}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pr-10 ${errors.organization ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.organization ? (
                      <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                    ) : formData.organization && !errors.organization ? (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                    ) : null}
                  </div>
                  {errors.organization && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center">
                      <XCircle className="w-3 h-3 mr-1" />
                      {errors.organization}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`pr-20 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {errors.password ? (
                    <XCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                  ) : formData.password && !errors.password ? (
                    <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                  ) : null}
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`pr-20 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {errors.confirmPassword ? (
                    <XCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                  ) : formData.confirmPassword && !errors.confirmPassword ? (
                    <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                  ) : null}
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 hover:from-amber-700 hover:via-orange-700 hover:to-yellow-700 text-white font-medium py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>


          </CardContent>
        </Card>
      </div>
    </div>
  )
} 