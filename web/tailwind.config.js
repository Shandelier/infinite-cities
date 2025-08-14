/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        suitability: {
          'very-low': '#b22a2b',    // Dark red for very low suitability
          'low': '#d6604d',         // Red for low suitability
          'medium': '#fee08b',      // Yellow for medium suitability  
          'high': '#a6d96a',        // Light green for high suitability
          'very-high': '#1a9850',   // Dark green for very high suitability
        },
        gray: {
          850: '#1f2937',
          950: '#0f172a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}