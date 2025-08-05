"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
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
  Info
} from "lucide-react"
export default function TermsAndConditionsPage() {
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
              Terms and Conditions
            </h1>
            <p className="text-stone-600 dark:text-stone-400 mt-2">
              Please read these terms carefully before using StatsOfIndia
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Introduction
              </CardTitle>
              <CardDescription>
                Last updated: {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                             <p className="text-stone-700 dark:text-stone-300">
                 Welcome to StatsOfIndia, a comprehensive data portal providing access to statistical information 
                 and datasets related to India. By accessing and using this platform, you agree to be bound by 
                 these Terms and Conditions.
               </p>
               <p className="text-stone-700 dark:text-stone-300">
                 These terms govern your use of our website and services. If you disagree with any part of 
                 these terms, you may not access our service.
               </p>
            </CardContent>
          </Card>

          {/* Definitions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Definitions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                                 <div>
                   <h4 className="font-semibold text-stone-900 dark:text-stone-100">Service</h4>
                   <p className="text-stone-700 dark:text-stone-300">
                     The StatsOfIndia website and platform operated by our organization.
                   </p>
                 </div>
                 <div>
                   <h4 className="font-semibold text-stone-900 dark:text-stone-100">User</h4>
                   <p className="text-stone-700 dark:text-stone-300">
                     The individual accessing or using the Service, or the company, or other legal entity 
                     on behalf of which such individual is accessing or using the Service.
                   </p>
                 </div>
                 <div>
                   <h4 className="font-semibold text-stone-900 dark:text-stone-100">Data</h4>
                   <p className="text-stone-700 dark:text-stone-300">
                     Statistical information, datasets, and related content available on our platform.
                   </p>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Registration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Account Registration and Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                                         <h4 className="font-semibold text-stone-900 dark:text-stone-100">Registration Requirements</h4>
                     <p className="text-stone-700 dark:text-stone-300">
                       You must provide accurate, current, and complete information during registration. 
                       You are responsible for maintaining the confidentiality of your account credentials.
                     </p>
                   </div>
                 </div>
                 <div className="flex items-start space-x-2">
                   <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                   <div>
                     <h4 className="font-semibold text-stone-900 dark:text-stone-100">Account Security</h4>
                     <p className="text-stone-700 dark:text-stone-300">
                       You are responsible for all activities that occur under your account. 
                       Notify us immediately of any unauthorized use of your account.
                     </p>
                   </div>
                 </div>
                 <div className="flex items-start space-x-2">
                   <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                   <div>
                     <h4 className="font-semibold text-stone-900 dark:text-stone-100">Age Requirement</h4>
                     <p className="text-stone-700 dark:text-stone-300">
                       You must be at least 13 years old to use this service. Users under 18 must have 
                       parental consent.
                     </p>
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Data Usage and Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                     <div>
                     <h4 className="font-semibold text-stone-900 dark:text-stone-100">Permitted Use</h4>
                     <p className="text-stone-700 dark:text-stone-300">
                       You may access and download datasets for research, educational, and non-commercial purposes. 
                       Commercial use requires prior written permission.
                     </p>
                   </div>
                 </div>
                 <div className="flex items-start space-x-2">
                   <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                   <div>
                     <h4 className="font-semibold text-stone-900 dark:text-stone-100">Prohibited Activities</h4>
                     <p className="text-stone-700 dark:text-stone-300">
                       You may not: redistribute data without permission, use data for illegal purposes, 
                       attempt to reverse engineer our systems, or interfere with service operation.
                     </p>
                   </div>
                 </div>
                 <div className="flex items-start space-x-2">
                   <Download className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                   <div>
                     <h4 className="font-semibold text-stone-900 dark:text-stone-100">Download Limits</h4>
                     <p className="text-stone-700 dark:text-stone-300">
                       Reasonable download limits apply to prevent abuse. We reserve the right to 
                       modify these limits with notice.
                     </p>
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy and Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                     <div>
                     <h4 className="font-semibold text-stone-900 dark:text-stone-100">Data Collection</h4>
                     <p className="text-stone-700 dark:text-stone-300">
                       We collect and process personal data in accordance with our Privacy Policy. 
                       Your data is protected using industry-standard security measures.
                     </p>
                   </div>
                 </div>
                 <div className="flex items-start space-x-2">
                   <Eye className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                   <div>
                     <h4 className="font-semibold text-stone-900 dark:text-stone-100">Usage Analytics</h4>
                     <p className="text-stone-700 dark:text-stone-300">
                       We may collect anonymous usage statistics to improve our service. 
                       This data does not identify individual users.
                     </p>
                   </div>
                 </div>
                 <div className="flex items-start space-x-2">
                   <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                   <div>
                     <h4 className="font-semibold text-stone-900 dark:text-stone-100">Data Retention</h4>
                     <p className="text-stone-700 dark:text-stone-300">
                       We retain your data only as long as necessary to provide our services 
                       or as required by law.
                     </p>
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Intellectual Property Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                                 <div>
                   <h4 className="font-semibold text-stone-900 dark:text-stone-100">Our Rights</h4>
                   <p className="text-stone-700 dark:text-stone-300">
                     The Service and its original content, features, and functionality are owned by 
                     StatsOfIndia and are protected by international copyright, trademark, patent, 
                     trade secret, and other intellectual property laws.
                   </p>
                 </div>
                 <div>
                   <h4 className="font-semibold text-stone-900 dark:text-stone-100">Data Attribution</h4>
                   <p className="text-stone-700 dark:text-stone-300">
                     When using our datasets, you must provide appropriate attribution to the original 
                     data sources as specified in the dataset metadata.
                   </p>
                 </div>
                 <div>
                   <h4 className="font-semibold text-stone-900 dark:text-stone-100">User Content</h4>
                   <p className="text-stone-700 dark:text-stone-300">
                     By uploading or submitting content to our platform, you grant us a non-exclusive, 
                     worldwide, royalty-free license to use, display, and distribute such content.
                   </p>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                                 <div>
                   <h4 className="font-semibold text-stone-900 dark:text-stone-100">Service Availability</h4>
                   <p className="text-stone-700 dark:text-stone-300">
                     We strive to maintain high service availability but do not guarantee uninterrupted 
                     access. We may temporarily suspend the service for maintenance or updates.
                   </p>
                 </div>
                 <div>
                   <h4 className="font-semibold text-stone-900 dark:text-stone-100">Data Accuracy</h4>
                   <p className="text-stone-700 dark:text-stone-300">
                     While we strive for accuracy, we do not guarantee the completeness, reliability, 
                     or accuracy of any information on our platform. Users should verify data independently.
                   </p>
                 </div>
                 <div>
                   <h4 className="font-semibold text-stone-900 dark:text-stone-100">Limitation of Liability</h4>
                   <p className="text-stone-700 dark:text-stone-300">
                     In no event shall StatsOfIndia be liable for any indirect, incidental, special, 
                     consequential, or punitive damages arising from your use of the service.
                   </p>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Account Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                                 <div>
                   <h4 className="font-semibold text-stone-900 dark:text-stone-100">Termination by User</h4>
                   <p className="text-stone-700 dark:text-stone-300">
                     You may terminate your account at any time by contacting us or using the account 
                     deletion feature in your dashboard.
                   </p>
                 </div>
                 <div>
                   <h4 className="font-semibold text-stone-900 dark:text-stone-100">Termination by Us</h4>
                   <p className="text-stone-700 dark:text-stone-300">
                     We may terminate or suspend your account immediately, without prior notice, 
                     for conduct that we believe violates these Terms or is harmful to other users.
                   </p>
                 </div>
                 <div>
                   <h4 className="font-semibold text-stone-900 dark:text-stone-100">Effect of Termination</h4>
                   <p className="text-stone-700 dark:text-stone-300">
                     Upon termination, your right to use the Service will cease immediately. 
                     We may delete your account data in accordance with our data retention policy.
                   </p>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                             <p className="text-stone-700 dark:text-stone-300">
                 We reserve the right to modify these terms at any time. We will notify users of 
                 significant changes via email or through our platform. Continued use of the service 
                 after changes constitutes acceptance of the new terms.
               </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                             <p className="text-stone-700 dark:text-stone-300">
                 If you have any questions about these Terms and Conditions, please contact us at:
               </p>
               <div className="bg-stone-50 dark:bg-stone-700 p-4 rounded-lg">
                 <p className="text-stone-700 dark:text-stone-300">
                   <strong>Email:</strong> support@statsofindia.com<br />
                   <strong>Address:</strong> StatsOfIndia Data Portal<br />
                   <strong>Response Time:</strong> We aim to respond within 24-48 hours
                 </p>
               </div>
            </CardContent>
          </Card>

          {/* Acceptance */}
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800 dark:text-green-200">
                <CheckCircle className="w-5 h-5 mr-2" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 dark:text-green-300">
                By using StatsOfIndia, you acknowledge that you have read, understood, and agree to 
                be bound by these Terms and Conditions. If you do not agree to these terms, 
                please do not use our service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 