/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0B0F19', // Deep dark cinematic background
        surface: {
          DEFAULT: '#111827', // Dark slate card surface
          muted: '#182234',   // Elevated dark surface
          subtle: '#222F46',  // Hover / control surface
          border: '#1F293D',  // Card borders
        },
        cine: {
          accent: '#E50914',         // Cinematic red
          'accent-hover': '#B91C1C', // Darker red on hover
          'accent-light': 'rgba(229, 9, 20, 0.15)',
          gold: '#F59E0B',           // Star rating gold
          'gold-light': 'rgba(245, 158, 11, 0.15)',
          dark: '#030712',
          body: '#E2E8F0',           // High-contrast clean text
          muted: '#94A3B8',          // Soft muted secondary text
          border: '#1E293B',         // Subtle container borders
          'border-subtle': '#162033',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        brand: ['"Cinzel"', '"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'subtle': '0 2px 6px 0 rgba(0, 0, 0, 0.4)',
        'card': '0 4px 14px 0 rgba(0, 0, 0, 0.5)',
        'card-hover': '0 12px 28px -4px rgba(0, 0, 0, 0.7), 0 0 16px -2px rgba(229, 9, 20, 0.15)',
      }
    },
  },
  plugins: [],
};
