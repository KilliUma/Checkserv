/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'wearcheck-blue': '#003366',
        'wearcheck-orange': '#FF6600',
      },
    },
  },
  plugins: [],
}
