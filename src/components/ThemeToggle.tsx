'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark'
    setDark(current)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    localStorage.setItem('zuno-theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 app-card inline-flex items-center justify-center transition-all duration-200 hover:shadow-brand-md hover:scale-110"
      aria-label="Toggle theme"
    >
      {dark ? (
        <Sun className="h-5 w-5 text-amber-500" />
      ) : (
        <Moon className="h-5 w-5 text-purple-500" />
      )}
    </button>
  )
}
