import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { trackUIEvent } from '../utils/analytics'

interface LogoProps {
  size?: 'xs' | 'small' | 'medium' | 'large' | 'hero'
  showText?: boolean
  className?: string
  onClick?: () => void
  variant?: 'default' | 'minimal' | 'compact'
}

function Logo({ 
  size = 'medium', 
  showText = true, 
  className = '', 
  onClick,
  variant = 'default'
}: LogoProps) {
  const { theme } = useTheme()
  const [imageError, setImageError] = useState(false)

  // Enhanced size configurations with responsive design
  const sizeConfig = {
    xs: {
      container: 'h-6',
      image: 'h-5 w-auto max-w-[120px]',
      text: 'text-sm font-bold',
      spacing: 'gap-1.5',
      subtitle: 'text-xs'
    },
    small: {
      container: 'h-8',
      image: 'h-7 w-auto max-w-[160px]',
      text: 'text-base font-bold',
      spacing: 'gap-2',
      subtitle: 'text-xs'
    },
    medium: {
      container: 'h-12',
      image: 'h-10 w-auto max-w-[200px]',
      text: 'text-lg md:text-xl font-bold',
      spacing: 'gap-3',
      subtitle: 'text-sm'
    },
    large: {
      container: 'h-16',
      image: 'h-14 w-auto max-w-[280px]',
      text: 'text-xl md:text-2xl font-bold',
      spacing: 'gap-4',
      subtitle: 'text-sm'
    },
    hero: {
      container: 'h-20',
      image: 'h-16 md:h-18 w-auto max-w-[320px]',
      text: 'text-2xl md:text-3xl lg:text-4xl font-bold',
      spacing: 'gap-4',
      subtitle: 'text-base'
    }
  }

  const config = sizeConfig[size]

  // Logo file paths - automatically switch based on theme
  const logoSrc = theme === 'dark' 
    ? '/images/logo-light.png'  // Light logo for dark theme
    : '/images/logo-dark.png'   // Dark logo for light theme

  // Logo is now available with the uploaded files
  const hasLogo = !imageError

  const handleClick = () => {
    if (onClick) {
      onClick()
      trackUIEvent('logo_clicked', { size, theme, variant })
    }
  }

  const handleImageError = () => {
    setImageError(true)
    console.warn('Logo image failed to load, falling back to text logo')
  }

  // Enhanced styling with hover effects and responsiveness
  const baseClasses = `flex items-center ${config.spacing} ${config.container} ${className}`
  const clickableClasses = onClick 
    ? 'cursor-pointer group transition-all duration-200 hover:scale-105 active:scale-95' 
    : ''
  
  const imageClasses = `${config.image} object-contain transition-all duration-200 ${
    onClick ? 'group-hover:brightness-110 group-hover:contrast-110' : ''
  }`

  // Variant-specific styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return 'opacity-90 hover:opacity-100'
      case 'compact':
        return 'max-w-max'
      default:
        return ''
    }
  }

  return (
    <div 
      className={`${baseClasses} ${clickableClasses} ${getVariantStyles()}`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      } : undefined}
    >
      {/* Logo Image */}
      {hasLogo ? (
        <img
          src={logoSrc}
          alt="Easy Timestamps - YouTube Timestamp Generator"
          className={imageClasses}
          onError={handleImageError}
          loading="eager"
          draggable={false}
        />
      ) : (
        // Fallback design when logo files aren't available or fail to load
        <div className={`${config.image.replace('w-auto', 'w-12')} flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white font-bold flex-shrink-0 shadow-lg ${onClick ? 'group-hover:shadow-xl group-hover:from-red-400 group-hover:via-red-500 group-hover:to-red-600' : ''} transition-all duration-200`}>
          <span className={size === 'xs' ? 'text-xs' : size === 'small' ? 'text-sm' : 'text-lg'}>
            ET
          </span>
        </div>
      )}

      {/* Logo Text - Only show if showText is true and not in compact variant */}
      {showText && variant !== 'compact' && (
        <div className="flex flex-col min-w-0">
          <span className={`${config.text} text-neutral-900 dark:text-white tracking-tight leading-tight transition-colors duration-200 ${onClick ? 'group-hover:text-red-600 dark:group-hover:text-red-400' : ''}`}>
            Easy Timestamps
          </span>
          {(size === 'hero' || size === 'large') && (
            <span className={`${config.subtitle} text-neutral-600 dark:text-gray-400 font-medium -mt-1 transition-colors duration-200 ${onClick ? 'group-hover:text-red-500 dark:group-hover:text-red-300' : ''}`}>
              YouTube Timestamp Generator
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default Logo