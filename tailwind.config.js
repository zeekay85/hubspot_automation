/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff7ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        ink: '#172033',
        muted: '#64748b',
      },
      boxShadow: {
        soft: '0 16px 40px rgba(15, 23, 42, 0.06)',
        card: '0 8px 24px rgba(15, 23, 42, 0.05)',
      },
    },
  },
  plugins: [],
};
