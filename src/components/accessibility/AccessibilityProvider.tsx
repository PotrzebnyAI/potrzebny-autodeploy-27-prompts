'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { AccessibilitySettings } from '@/types'

const defaultSettings: AccessibilitySettings = {
  mode: 'standard',
  font_size: 'medium',
  font_family: 'sans',
  high_contrast: false,
  reduce_motion: false,
  focus_mode: false,
  color_blind_mode: 'none',
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (settings: Partial<AccessibilitySettings>) => void
  resetSettings: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null)

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

interface AccessibilityProviderProps {
  children: React.ReactNode
  initialSettings?: AccessibilitySettings
}

export function AccessibilityProvider({
  children,
  initialSettings,
}: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(
    initialSettings || defaultSettings
  )

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement

    // Font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xl: '20px',
    }
    root.style.fontSize = fontSizes[settings.font_size]

    // Font family
    const fontFamilies = {
      sans: 'Inter, system-ui, sans-serif',
      dyslexic: 'OpenDyslexic, Comic Sans MS, sans-serif',
      mono: 'JetBrains Mono, monospace',
    }
    root.style.fontFamily = fontFamilies[settings.font_family]

    // Accessibility mode classes
    root.classList.remove('mode-standard', 'mode-adhd', 'mode-dyslexia', 'mode-asd', 'mode-custom')
    root.classList.add(`mode-${settings.mode}`)

    // High contrast
    root.classList.toggle('high-contrast', settings.high_contrast)

    // Reduce motion
    if (settings.reduce_motion) {
      root.style.setProperty('--animation-duration', '0.01ms')
      root.classList.add('reduce-motion')
    } else {
      root.style.removeProperty('--animation-duration')
      root.classList.remove('reduce-motion')
    }

    // Focus mode
    root.classList.toggle('focus-mode', settings.focus_mode)

    // Color blind mode
    root.classList.remove('cb-protanopia', 'cb-deuteranopia', 'cb-tritanopia')
    if (settings.color_blind_mode !== 'none') {
      root.classList.add(`cb-${settings.color_blind_mode}`)
    }

    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
  }, [settings])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch {
        // Invalid JSON, use defaults
      }
    }

    // Check for system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettings(prev => ({ ...prev, reduce_motion: true }))
    }
  }, [])

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  )
}
