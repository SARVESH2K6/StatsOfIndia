"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { 
  ArrowLeft,
  Shield,
  FileText,
  Users,
  Database,
  Lock,
  Eye,
  Download,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Info,
  Mail,
  Globe,
  Calendar
} from "lucide-react"
export default function PrivacyPolicyPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-stone-900 dark:to-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
              Privacy Policy
            </h1>
            <p className="text-stone-600 dark:text-stone-400 mt-2">
              How we collect, use, and protect your personal information
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Introduction
              </CardTitle>
              <CardDescription>
                Last updated: {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                At StatsOfIndia, we are committed to protecting your privacy and ensuring the security 
                of your personal information. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you use our data portal.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                By using our service, you consent to the data practices described in this policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Personal Information</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    When you register for an account, we collect your name, email address, phone number 
                    (optional), and organization (optional). This information is used to create and manage 
                    your account.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Usage Data</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    We automatically collect information about how you use our service, including your 
                    search queries, downloaded datasets, bookmarked content, and browsing patterns.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Technical Information</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    We collect technical information such as your IP address, browser type, operating 
                    system, and device information to improve our service and ensure security.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Account Management</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      To create and maintain your account, provide customer support, and send important 
                      service updates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Service Improvement</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      To analyze usage patterns, improve our platform, and develop new features based 
                      on user behavior.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Personalization</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      To provide personalized content, recommendations, and preferences based on your 
                      usage history.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Security</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      To detect and prevent fraud, abuse, and security threats to protect our users 
                      and platform.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">We Do Not Sell Your Data</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    We do not sell, trade, or rent your personal information to third parties for 
                    marketing purposes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Service Providers</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    We may share information with trusted service providers who assist us in operating 
                    our platform, such as hosting providers and analytics services.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Legal Requirements</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    We may disclose your information if required by law or to protect our rights, 
                    property, or safety, or that of our users.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Aggregated Data</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    We may share anonymized, aggregated data for research and statistical purposes 
                    that does not identify individual users.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Encryption</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      We use industry-standard encryption to protect your data during transmission 
                      and storage.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Access Controls</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      We implement strict access controls and authentication measures to ensure 
                      only authorized personnel can access your data.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Regular Audits</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      We conduct regular security audits and assessments to identify and address 
                      potential vulnerabilities.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Account Data</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    We retain your account information for as long as your account is active or 
                    as needed to provide you services.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Usage Data</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Usage data is retained for up to 2 years to improve our service and provide 
                    personalized features.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Account Deletion</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    When you delete your account, we will delete your personal information within 
                    30 days, except where retention is required by law.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Access</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      You have the right to access and review your personal information stored in our systems.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Correction</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      You can update or correct your personal information through your account settings.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Deletion</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      You can request deletion of your account and personal data at any time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Portability</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      You can request a copy of your data in a portable format.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Cookies and Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Essential Cookies</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    We use essential cookies to maintain your session and provide core functionality. 
                    These cannot be disabled.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Analytics Cookies</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    We use analytics cookies to understand how users interact with our platform 
                    and improve our service. You can opt out of these cookies.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Third-Party Cookies</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Some third-party services we use may set their own cookies. We do not control 
                    these cookies and they are subject to their respective privacy policies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Children's Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Our service is not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13. If you are a parent or guardian 
                and believe your child has provided us with personal information, please contact us 
                immediately.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Changes to This Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                We may update this Privacy Policy from time to time. We will notify you of any 
                significant changes by email or through our platform. Your continued use of our 
                service after changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> privacy@statsofindia.com<br />
                  <strong>Address:</strong> StatsOfIndia Data Portal<br />
                  <strong>Response Time:</strong> We aim to respond within 24-48 hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 