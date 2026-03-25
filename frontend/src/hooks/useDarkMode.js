import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing dark mode with localStorage persistence
 */
export function useDarkMode() {
  // Initialize dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    try {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme !== null) {
        return JSON.parse(savedTheme);
      }
    } catch (error) {
      console.error('Failed to read dark mode from localStorage:', error);
    }

    // Fall back to system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Default to light mode
    return false;
  });

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;

      // Save to localStorage
      try {
        localStorage.setItem('darkMode', JSON.stringify(newMode));
      } catch (error) {
        console.error('Failed to save dark mode to localStorage:', error);
      }

      return newMode;
    });
  }, []);

  // Set specific mode
  const setDarkMode = useCallback((enabled) => {
    setIsDarkMode(enabled);

    // Save to localStorage
    try {
      localStorage.setItem('darkMode', JSON.stringify(enabled));
    } catch (error) {
      console.error('Failed to save dark mode to localStorage:', error);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Update CSS custom property for smoother transitions
    root.style.setProperty('--theme-transition', 'all 0.3s ease');

  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme === null) {
        setIsDarkMode(e.matches);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return {
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
  };
}