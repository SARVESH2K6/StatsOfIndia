"use client"

import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, Shield, FileText, Users, Database, Lock } from "lucide-react"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-stone-900 dark:via-neutral-800 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent tracking-tight">
                Terms & Conditions
              </h1>
              <p className="text-sm text-muted-foreground font-medium">StatsOfIndia Platform</p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <Card className="shadow-xl border-0 bg-stone-50/80 backdrop-blur-sm dark:bg-stone-900/80">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              Terms and Conditions of Use
            </CardTitle>
            <CardDescription className="text-stone-600 dark:text-stone-400">
              Last updated: {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 text-stone-700 dark:text-stone-300">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-amber-600" />
                1. Introduction
              </h2>
              <p className="leading-relaxed">
                Welcome to StatsOfIndia, a comprehensive statistics platform for exploring and analyzing data across Indian states and union territories. 
                These Terms and Conditions govern your use of our platform and services. By accessing or using StatsOfIndia, you agree to be bound by these terms.
              </p>
            </section>

            {/* Definitions */}
            <section>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3 flex items-center">
                <Database className="w-5 h-5 mr-2 text-amber-600" />
                2. Definitions
              </h2>
              <div className="space-y-2">
                <p><strong>"Platform"</strong> refers to the StatsOfIndia website and services.</p>
                <p><strong>"User"</strong> refers to any individual or entity using our platform.</p>
                <p><strong>"Data"</strong> refers to statistical information, datasets, and related content.</p>
                <p><strong>"Services"</strong> refers to all features and functionality provided by StatsOfIndia.</p>
              </div>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2 text-amber-600" />
                3. User Accounts and Registration
              </h2>
              <div className="space-y-3">
                <p>To access certain features of StatsOfIndia, you must create an account. You agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your login credentials secure and confidential</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </div>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-amber-600" />
                4. Acceptable Use Policy
              </h2>
              <div className="space-y-3">
                <p>You agree to use StatsOfIndia only for lawful purposes and in accordance with these terms. You must not:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Use the platform for any illegal or unauthorized purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the platform's functionality</li>
                  <li>Upload malicious code or content</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Use automated systems to access the platform without permission</li>
                </ul>
              </div>
            </section>

            {/* Data Usage */}
            <section>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3 flex items-center">
                <Database className="w-5 h-5 mr-2 text-amber-600" />
                5. Data Usage and Attribution
              </h2>
              <div className="space-y-3">
                <p>When using data from StatsOfIndia:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You may use the data for research, analysis, and educational purposes</li>
                  <li>You must provide proper attribution to the original data sources</li>
                  <li>You may not claim ownership of the data or misrepresent its source</li>
                  <li>Commercial use may require additional permissions</li>
                  <li>You are responsible for verifying data accuracy for your specific use case</li>
                </ul>
              </div>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-amber-600" />
                6. Privacy and Data Protection
              </h2>
              <div className="space-y-3">
                <p>Your privacy is important to us. Our data collection and usage practices are governed by our Privacy Policy, which is incorporated into these terms by reference.</p>
                <p>We collect and process personal information to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide and maintain our services</li>
                  <li>Improve user experience and platform functionality</li>
                  <li>Send important notifications and updates</li>
                  <li>Ensure platform security and prevent abuse</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                7. Intellectual Property Rights
              </h2>
              <div className="space-y-3">
                <p>The StatsOfIndia platform, including its design, code, and original content, is protected by intellectual property laws. You may not:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Copy, modify, or distribute our platform code without permission</li>
                  <li>Use our trademarks or branding without authorization</li>
                  <li>Reverse engineer or attempt to extract our source code</li>
                  <li>Create derivative works based on our platform</li>
                </ul>
              </div>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                8. Disclaimers and Limitations
              </h2>
              <div className="space-y-3">
                <p>StatsOfIndia is provided "as is" without warranties of any kind. We disclaim:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Warranties of accuracy, completeness, or reliability of data</li>
                  <li>Warranties of merchantability or fitness for a particular purpose</li>
                  <li>Warranties that the platform will be uninterrupted or error-free</li>
                  <li>Warranties regarding third-party data sources or content</li>
                </ul>
                <p>We are not responsible for any decisions made based on the data provided through our platform.</p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                9. Limitation of Liability
              </h2>
              <p className="leading-relaxed">
                To the maximum extent permitted by law, StatsOfIndia shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including but not limited to loss of profits, data, or use, arising from your use of the platform.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                10. Account Termination
              </h2>
              <div className="space-y-3">
                <p>We may terminate or suspend your account at any time for:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Violation of these terms and conditions</li>
                  <li>Fraudulent or illegal activities</li>
                  <li>Abuse of platform resources</li>
                  <li>Extended periods of inactivity</li>
                </ul>
                <p>You may terminate your account at any time by contacting our support team.</p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                11. Changes to Terms
              </h2>
              <p className="leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of significant changes through the platform or email. 
                Continued use of StatsOfIndia after changes constitutes acceptance of the new terms.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                12. Governing Law
              </h2>
              <p className="leading-relaxed">
                These terms are governed by the laws of India. Any disputes arising from these terms or your use of StatsOfIndia shall be resolved 
                through appropriate legal channels in accordance with Indian law.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                13. Contact Information
              </h2>
              <p className="leading-relaxed">
                If you have questions about these Terms and Conditions, please contact us through our support channels or email us at support@statsofindia.com
              </p>
            </section>

            {/* Agreement */}
            <section className="border-t pt-6 mt-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>By using StatsOfIndia, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</strong>
                </p>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" className="border-amber-200 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/privacy">
              <Button variant="outline" className="border-amber-200 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/20">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 