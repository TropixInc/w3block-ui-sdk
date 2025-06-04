module.exports = {
  content: [
    './src/**/*.{js,ts,tsx,jsx}',
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
      boxShadow: {
        'brand-shadow': '1px 1px 10px rgba(0, 0, 0, 0.2)',
      },
      colors: {
        'brand-primary': 'rgb(var(--colors-brand-primary) / <alpha-value>)',
      },
      variables: {
        DEFAULT: {
          colors: {
            'brand-primary': '#295BA6',
          },
        },
      },
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
      roboto: ['Roboto', 'sans-serif'],
      poppins: ['Poppins', 'sans-serif'],
      nunito: ['Nunito', 'sans-serif'],
      montserrat: ['Montserrat', 'sans-serif'],
      aeonik: ['Aeonik', 'sans-serif'],
    },
  },
  prefix: 'pw-',
  variants: {
    extend: {
      text: ['odd', 'even'],
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
  ],
};
