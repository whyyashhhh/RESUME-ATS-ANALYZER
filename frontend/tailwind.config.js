/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      colors: {
        brand: {
          50: '#ecfbf6',
          100: '#c9f3e5',
          200: '#9be7cf',
          500: '#15a37a',
          700: '#0c6f52',
          900: '#083b2b',
        },
        accent: {
          50: '#fff8e8',
          200: '#ffd88a',
          500: '#f5a524',
          700: '#b96b04',
        },
      },
      boxShadow: {
        glow: '0 20px 60px rgba(21, 163, 122, 0.18)',
        panel: '0 16px 40px rgba(2, 8, 23, 0.35)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top left, rgba(21,163,122,0.32), transparent 38%), radial-gradient(circle at 80% 12%, rgba(245,165,36,0.16), transparent 28%), linear-gradient(180deg, rgba(2,6,23,0.96), rgba(3,9,26,0.98))',
      },
    },
  },
  plugins: [],
};
