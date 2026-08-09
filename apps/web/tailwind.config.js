/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#08090B',
        surface: {
          elevated: '#0D0F12',
          card: '#111318',
          hover: '#171A20',
        },
        border: {
          subtle: '#232731',
        },
        accent: {
          primary: '#7C5CFC',
          secondary: '#4F8CFF',
        },
        status: {
          success: '#32D583',
          warning: '#F5B942',
          error: '#F97066',
        },
      },
    },
  },
  plugins: [],
};
