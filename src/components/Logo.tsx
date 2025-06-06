import { useTheme } from '../contexts/ThemeContext'
import { trackUIEvent } from '../utils/analytics'

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'hero'
  showText?: boolean
  className?: string
  onClick?: () => void
}

function Logo({ size = 'medium', showText = true, className = '', onClick }: LogoProps) {
  const { theme } = useTheme()

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'h-8',
      image: 'h-6 w-6',
      text: 'text-lg font-bold',
      spacing: 'gap-2'
    },
    medium: {
      container: 'h-12',
      image: 'h-10 w-10',
      text: 'text-xl font-bold',
      spacing: 'gap-3'
    },
    large: {
      container: 'h-16',
      image: 'h-14 w-14',
      text: 'text-2xl font-bold',
      spacing: 'gap-4'
    },
    hero: {
      container: 'h-20',
      image: 'h-16 w-16',
      text: 'text-3xl font-bold',
      spacing: 'gap-4'
    }
  }

  const config = sizeConfig[size]

  // Logo file paths (you'll add these files)
  const logoSrc = theme === 'dark' 
    ? '/images/logo-light.svg'  // Light logo for dark theme
    : '/images/logo-dark.svg'   // Dark logo for light theme

  // Fallback to a simple text logo if images aren't available
  const hasLogo = false // Set to true once you add the logo files

  const handleClick = () => {
    if (onClick) {
      onClick()
      trackUIEvent('logo_clicked', { size, theme })
    }
  }

  const baseClasses = `flex items-center ${config.spacing} ${config.container} ${className}`
  const clickableClasses = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''

  return (
    <div 
      className={`${baseClasses} ${clickableClasses}`}
      onClick={handleClick}
    >
      {/* Logo Image */}
      {hasLogo ? (
        <img
          src={logoSrc}
          alt="Easy Timestamps Logo"
          className={`${config.image} object-contain`}
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
      ) : (
        // Fallback icon/symbol when no logo files are available
        <div className={`${config.image} flex items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white font-bold flex-shrink-0`}>
          <span className="text-sm">ET</span>
        </div>
      )}

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${config.text} text-neutral-900 dark:text-white tracking-tight leading-tight`}>
            Easy Timestamps
          </span>
          {size === 'hero' && (
            <span className="text-sm text-neutral-600 dark:text-gray-400 font-medium -mt-1">
              YouTube Timestamp Generator
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default Logo