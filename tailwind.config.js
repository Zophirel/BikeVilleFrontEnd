/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{html,ts}" ],
  theme: {
    extend: {
      transitionProperty: {
        'max-height': 'max-height',
      }
    },
    'body': ['"Work Sans"'],
  },
  plugins: [],
}

