import TimestampExtractor from './components/TimestampExtractor'
import { useTheme } from './contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="relative text-center py-12 px-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
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
        <h2 className="text-xl md:text-2xl font-normal text-neutral-600 dark:text-gray-300">
          Create timestamps for YouTube videos.
        </h2>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        <TimestampExtractor />
      </main>
    </div>
  )
}

export default App