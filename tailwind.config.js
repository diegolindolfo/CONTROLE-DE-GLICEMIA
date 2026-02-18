/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        primary: {
          DEFAULT: '#10b981',
          hover: '#059669',
        },
        secondary: {
          DEFAULT: '#0ea5e9',
          hover: '#0284c7',
        },
        danger: {
          DEFAULT: '#f43f5e',
          hover: '#e11d48',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
