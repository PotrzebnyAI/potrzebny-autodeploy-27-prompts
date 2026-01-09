import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2a96a1',
          dark: '#1e7a84',
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5fe9ce',
          400: '#2dd4b8',
          500: '#2a96a1',
          600: '#1e7a84',
          700: '#1a6570',
          800: '#195159',
          900: '#18434a',
        },
        secondary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        success: {
          DEFAULT: '#22c55e',
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          DEFAULT: '#eab308',
          50: '#fefce8',
          500: '#eab308',
          600: '#ca8a04',
        },
        error: {
          DEFAULT: '#ef4444',
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        // Accessibility-focused color schemes
        adhd: {
          bg: '#fef3c7',
          accent: '#f59e0b',
          text: '#78350f',
          border: '#fbbf24',
        },
        dyslexia: {
          bg: '#fffff0',
          text: '#333333',
          accent: '#4a5568',
          border: '#e2e8f0',
        },
        asd: {
          bg: '#f0fdf4',
          border: '#86efac',
          text: '#166534',
          accent: '#22c55e',
        },
        // Panel-specific colors
        panel: {
          teacher: '#3b82f6',
          lecturer: '#8b5cf6',
          therapist: '#ec4899',
          doctor: '#ef4444',
          patient: '#14b8a6',
          student: '#22c55e',
          superbrain: '#f59e0b',
          admin: '#6366f1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        dyslexic: ['OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        'touch-min': '44px',
        'touch-lg': '56px',
      },
      borderRadius: {
        'accessibility': '8px',
      },
      fontSize: {
        'accessibility-sm': ['1rem', { lineHeight: '1.75' }],
        'accessibility-base': ['1.125rem', { lineHeight: '1.75' }],
        'accessibility-lg': ['1.25rem', { lineHeight: '1.75' }],
      },
      animation: {
        'pulse-dopamine': 'pulse-dopamine 0.5s ease-in-out',
        'confetti': 'confetti 1s ease-out forwards',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'bounce-subtle': 'bounce-subtle 0.6s ease-in-out',
        'progress-bar': 'progress-bar 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-dopamine': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        'confetti': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'progress-bar': {
          '0%': { width: '0%' },
          '50%': { width: '70%' },
          '100%': { width: '100%' },
        },
      },
      boxShadow: {
        'panel': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'panel-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'focus-ring': '0 0 0 3px rgba(42, 150, 161, 0.5)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
