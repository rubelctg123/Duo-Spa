/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCF9',
          100: '#FAF7F0',
          200: '#F4EFE6',
          300: '#ECE3D4',
        },
        sage: {
          50: '#F5F7F5',
          100: '#E8ECE7',
          200: '#D2DBD0',
          300: '#ADC0AA',
          400: '#87A384',
          500: '#648561',
          600: '#4D6B4B',
          700: '#3C533A',
          800: '#2E3F2D',
          900: '#202C1F',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F4EFEA',
          200: '#E7DDCF',
          300: '#D5C4B0',
          400: '#BFA68E',
          500: '#A6886E',
          600: '#886B52',
          700: '#6A523E',
          800: '#4E3C2E',
        },
        gold: {
          50: '#FAF7EE',
          100: '#F5EED5',
          200: '#EADBAB',
          300: '#DCBF7A',
          400: '#CCA04D',
          500: '#B88628',
          600: '#94671B',
          700: '#734D13',
        },
        taupe: {
          900: '#231F20',
          800: '#342F2D',
          700: '#48423E',
          600: '#635B56',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
