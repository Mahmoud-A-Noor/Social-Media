import { useState, useEffect } from 'react';

const useThemeSwitcher = (defaultTheme = 'light') => {
  // Retrieve the saved theme from localStorage or use the default theme
  const storedTheme = localStorage.getItem('theme') || defaultTheme;
  const [theme, setTheme] = useState(storedTheme);

  useEffect(() => {
    // Apply the theme by adding/removing a class to the body element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Save the selected theme to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return [theme, toggleTheme];
};

export default useThemeSwitcher;