"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

interface ThemeToggleProps {
  userTheme?: 'light' | 'dark' | 'auto'
  onThemeChange?: (theme: 'light' | 'dark' | 'auto') => void
  className?: string
}

export function ThemeToggle({ userTheme, onThemeChange, className = "" }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      // If user has a theme preference, use it
      if (userTheme && userTheme !== 'auto') {
        return userTheme === "dark"
      }
      // Otherwise use localStorage or system preference
      const stored = localStorage.getItem("theme")
      if (stored) return stored === "dark"
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle("dark", isDark)
    
    // Save to localStorage for fallback
    localStorage.setItem("theme", isDark ? "dark" : "light")
    
    // Notify parent component if callback provided
    if (onThemeChange) {
      onThemeChange(isDark ? "dark" : "light")
    }
  }, [isDark, onThemeChange])

  // Listen for system theme changes if user preference is 'auto'
  useEffect(() => {
    if (userTheme === 'auto') {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDark(e.matches)
      }
      
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [userTheme])

  // Update theme when userTheme prop changes
  useEffect(() => {
    if (userTheme) {
      if (userTheme === 'auto') {
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
      } else {
        setIsDark(userTheme === "dark")
      }
    }
  }, [userTheme])

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setIsDark((prev) => !prev)}
      className={`relative w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${isDark ? "bg-gray-700" : "bg-gray-200"} ${className}`}
    >
      <span
        className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow flex items-center justify-center transition-transform duration-300 bg-white ${isDark ? "translate-x-6" : "translate-x-0"}`}
      >
        {isDark ? <Moon className="w-3 h-3 text-yellow-400" /> : <Sun className="w-3 h-3 text-orange-400" />}
      </span>
      <span className="absolute left-1.5 text-gray-400 dark:text-gray-500">
        <Sun className="w-3 h-3" />
      </span>
      <span className="absolute right-1.5 text-gray-400 dark:text-gray-300">
        <Moon className="w-3 h-3" />
      </span>
    </button>
  )
}
