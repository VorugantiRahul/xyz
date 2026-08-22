/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#08090D',
        surface: {
          DEFAULT: '#11131A',
          secondary: '#171923',
          card: '#131622',
        },
        primary: {
          DEFAULT: '#836EF9',
          hover: '#6F5CE7',
          light: '#9E8DFB',
          glow: 'rgba(131, 110, 249, 0.15)',
        },
        text: {
          DEFAULT: '#F5F5F7',
          secondary: '#A5A7B4',
          muted: '#6C6F80',
        },
        success: {
          DEFAULT: '#22C55E',
          surface: 'rgba(34, 197, 94, 0.1)',
          border: 'rgba(34, 197, 94, 0.25)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          surface: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.25)',
        },
        danger: {
          DEFAULT: '#EF4444',
          surface: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.25)',
        },
        border: {
          DEFAULT: '#272A36',
          light: '#35394A',
          highlight: 'rgba(131, 110, 249, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(131, 110, 249, 0.25)',
        'glow-card': '0 8px 30px rgba(0, 0, 0, 0.45)',
        'glow-active': '0 0 20px -2px rgba(34, 197, 94, 0.25)',
        'inner-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
