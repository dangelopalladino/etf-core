import type { Config } from 'tailwindcss';

// Color tokens replicate SHARED palette so etf-core primitive class strings
// resolve correctly without depending on a consumer app's Tailwind config.
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    '../src/ui-server/**/*.{ts,tsx}',
    '../src/ui-client/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D7A7B',
        accent: '#C27B5C',
        surface: {
          DEFAULT: '#F5EFE6',
          ground: '#EDE6DA',
          raised: '#FAF5EE',
        },
        border: {
          DEFAULT: '#E5DDD4',
          subtle: '#F0E8DF',
          emphasis: '#D4CBC0',
        },
        text: {
          primary: '#3A3632',
          secondary: '#6B6560',
          muted: '#A8A29E',
        },
      },
      fontFamily: {
        sans: ['"General Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
