module.exports = {
  content: [
    './src/modules/**/*.{js,ts,tsx,jsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm: '768px',
      lg: '1024px',
      xl: '1306px',
      x2l: '1440px',
    },
    extend: {
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        17: '4.25rem',
        21: '5.25rem',
        23: '5.75rem',
        29: '7.25rem',
        51: '12.75rem',
      },
    },
    colors: {
      'pw-gray': '#EDEDED',
    },
  },
  prefix: 'pw-',
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
