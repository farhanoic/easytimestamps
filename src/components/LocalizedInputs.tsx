import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface LocalizedTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const LocalizedTimeInput: React.FC<LocalizedTimeInputProps> = ({
  value,
  onChange,
  placeholder,
  className = ''
}) => {
  const { config, isRTL } = useLocalization();
  
  const formatTimeDisplay = (timeValue: string) => {
    if (!timeValue || !timeValue.includes(':')) return timeValue;
    
    const [hours, minutes, seconds] = timeValue.split(':');
    const hoursNum = parseInt(hours, 10);
    
    if (config.timeFormat === '12h' && hoursNum >= 0) {
      const period = hoursNum >= 12 ? 'PM' : 'AM';
      const displayHours = hoursNum === 0 ? 12 : hoursNum > 12 ? hoursNum - 12 : hoursNum;
      return `${displayHours}:${minutes}${seconds ? `:${seconds}` : ''} ${period}`;
    }
    
    return timeValue;
  };

  const parseTimeInput = (displayValue: string) => {
    if (!displayValue) return '';
    
    // If 12-hour format with AM/PM
    if (config.timeFormat === '12h' && (displayValue.includes('AM') || displayValue.includes('PM'))) {
      const isPM = displayValue.includes('PM');
      const timeOnly = displayValue.replace(/\s?(AM|PM)/i, '');
      const [hours, minutes, seconds] = timeOnly.split(':');
      let hoursNum = parseInt(hours, 10);
      
      if (isPM && hoursNum !== 12) hoursNum += 12;
      if (!isPM && hoursNum === 12) hoursNum = 0;
      
      return `${hoursNum.toString().padStart(2, '0')}:${minutes}${seconds ? `:${seconds}` : ''}`;
    }
    
    return displayValue;
  };

  return (
    <input
      type="text"
      value={formatTimeDisplay(value)}
      onChange={(e) => onChange(parseTimeInput(e.target.value))}
      placeholder={placeholder}
      className={`
        ${className}
        ${isRTL ? 'text-right' : 'text-left'}
        font-mono
        ltr-content
      `}
      dir="ltr"
    />
  );
};

interface LocalizedNumberInputProps {
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const LocalizedNumberInput: React.FC<LocalizedNumberInputProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  min,
  max,
  step = 1
}) => {
  const { config, isRTL } = useLocalization();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Replace locale-specific decimal separator with standard dot
    const normalizedValue = inputValue
      .replace(config.numberFormat.decimal, '.')
      .replace(new RegExp(config.numberFormat.thousands.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
    
    const numericValue = parseFloat(normalizedValue);
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    } else if (inputValue === '') {
      onChange(0);
    }
  };

  const displayValue = typeof value === 'number' ? 
    value.toString().replace('.', config.numberFormat.decimal) : 
    value.toString();

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={`
        ${className}
        ${isRTL ? 'text-right' : 'text-left'}
      `}
      min={min}
      max={max}
      step={step}
    />
  );
};

interface LocalizedDateInputProps {
  value: Date | string;
  onChange: (value: Date) => void;
  placeholder?: string;
  className?: string;
}

export const LocalizedDateInput: React.FC<LocalizedDateInputProps> = ({
  value,
  onChange,
  placeholder,
  className = ''
}) => {
  const { isRTL } = useLocalization();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = new Date(e.target.value);
    if (!isNaN(dateValue.getTime())) {
      onChange(dateValue);
    }
  };

  const formatDateForInput = (date: Date | string) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  };

  return (
    <div className="relative">
      <input
        type="date"
        value={formatDateForInput(value as Date)}
        onChange={handleChange}
        className={`
          ${className}
          ${isRTL ? 'text-right' : 'text-left'}
        `}
      />
      <div className={`
        absolute inset-0 pointer-events-none flex items-center
        ${isRTL ? 'justify-end pr-3' : 'justify-start pl-3'}
        text-gray-500 text-sm
      `}>
        {!value && placeholder}
      </div>
    </div>
  );
};

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder,
  className = ''
}) => {
  const { config, isRTL } = useLocalization();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d.,]/g, '');
    const normalizedValue = inputValue
      .replace(config.numberFormat.decimal, '.')
      .replace(new RegExp(config.numberFormat.thousands.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
    
    const numericValue = parseFloat(normalizedValue);
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    } else if (inputValue === '') {
      onChange(0);
    }
  };

  return (
    <div className={`relative ${isRTL ? 'rtl' : 'ltr'}`}>
      <span className={`
        absolute top-1/2 transform -translate-y-1/2 text-gray-500
        ${isRTL ? 'right-3' : 'left-3'}
      `}>
        {config.numberFormat.currency}
      </span>
      <input
        type="text"
        value={value ? value.toString() : ''}
        onChange={handleChange}
        placeholder={placeholder}
        className={`
          ${className}
          ${isRTL ? 'pr-8 text-right' : 'pl-8 text-left'}
        `}
      />
    </div>
  );
};