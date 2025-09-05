'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { 
  IconSun,
  IconMoon,
  IconDeviceDesktop
} from '@tabler/icons-react'

type Theme = 'light' | 'dark' | 'system'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme('system')
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.toggle('dark', systemTheme === 'dark')
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }
    
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const cycleTheme = () => {
    setTheme(prev => {
      switch (prev) {
        case 'light':
          return 'dark'
        case 'dark':
          return 'system'
        case 'system':
          return 'light'
        default:
          return 'dark'
      }
    })
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <IconSun className="h-4 w-4" />
      case 'dark':
        return <IconMoon className="h-4 w-4" />
      case 'system':
        return <IconDeviceDesktop className="h-4 w-4" />
      default:
        return <IconMoon className="h-4 w-4" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'system':
        return 'System'
      default:
        return 'Dark'
    }
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="text-gray-400">
        <IconMoon className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className="text-gray-400 hover:text-white transition-colors"
      title={`Current theme: ${getLabel()}`}
    >
      {getIcon()}
    </Button>
  )
}

// Theme Provider Hook
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    const root = document.documentElement
    root.classList.toggle('dark', newTheme === 'dark')
  }

  return {
    theme,
    toggleTheme,
    mounted
  }
}
