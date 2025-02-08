import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts}",
  ],
  safelist: [
    'h-8',
    'w-8',
    'w-16',
    'w-24',
    'w-32',
    'w-auto',
    'rounded-full'
  ],
  theme: {
    extend: {
      textShadow: {
        'md': '2px 2px 4px rgba(0, 0, 0, 0.5)',
        'lg': '3px 3px 6px rgba(0, 0, 0, 0.5)',
        'xl': '4px 4px 8px rgba(0, 0, 0, 0.5)',
        '3xl': '0 0 3px #ffffff, 0 0 5px #ffffff, 0 0 7px #ffffff, 0 0 10px #ffffff',
      },
      fontFamily: {
        sora: ['var(--font-sora)'],
        noto: ['var(--font-noto-sans)'],
        poppins: ['var(--font-poppins)'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      colors: {
        'blue': {
          600: '#2563eb',
          700: '#1d4ed8',
        },
        'indigo': {
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
    require('daisyui'),
    function ({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
      const newUtilities = {
        '.text-shadow-md': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-lg': {
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-xl': {
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-3xl': {
          textShadow: '0 0 3px #ffffff, 0 0 5px #ffffff, 0 0 7px #ffffff, 0 0 10px #ffffff',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
export default config;
