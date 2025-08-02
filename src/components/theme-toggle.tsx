"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme")
      if (stored) return stored === "dark"
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }, [isDark])

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setIsDark((prev) => !prev)}
      className={`relative w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
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
