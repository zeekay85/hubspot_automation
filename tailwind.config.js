/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9edff',
          500: '#2f80ed',
          600: '#1b66d2',
          700: '#164fa4',
        },
        ink: '#14213d',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(20, 33, 61, 0.08)',
      },
    },
  },
  plugins: [],
};
