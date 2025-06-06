import TimestampExtractor from './components/TimestampExtractor'
import { useTheme } from './contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'
import { trackUIEvent, trackFeatureUsage } from './utils/analytics'

function App() {
  const { theme, toggleTheme } = useTheme()

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    toggleTheme()
    
    // Track theme toggle
    trackUIEvent('theme_changed', {
      from_theme: theme,
      to_theme: newTheme
    })
    trackFeatureUsage('theme_toggle')
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="relative text-center py-12 px-4">
        {/* Theme Toggle Button */}
        <button
          onClick={handleThemeToggle}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors duration-200"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-neutral-700 dark:text-gray-300" />
          ) : (
            <Sun className="h-5 w-5 text-neutral-700 dark:text-gray-300" />
          )}
        </button>
        
        <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-4 tracking-tight">
          Easy Timestamps
        </h1>
        <p className="text-xl md:text-2xl font-normal text-neutral-600 dark:text-gray-300 mb-2">
          Free YouTube Timestamp & Chapter Generator
        </p>
        <p className="text-base md:text-lg text-neutral-500 dark:text-gray-400 max-w-2xl mx-auto">
          Create professional YouTube timestamps and video chapters instantly. Perfect for content creators, educators, and video professionals.
        </p>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        <TimestampExtractor />
      </main>
    </div>
  )
}

export default App