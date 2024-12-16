/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{html,ts}" ],
  theme: {
    extend: {
      transitionProperty: {
        'max-height': 'max-height',
      },
      colors: {
        'primary': {
          0: '#000000',
          10: '#211b00',
          20: '#393000',
          25: '#463b00',
          30: '#534600',
          35: '#605201',
          40: '#6d5e0f',
          50: '#877728',
          60: '#a2903f',
          70: '#beab57',
          80: '#dac66f',
          90: '#f8e287',
          95: '#fff1bc',
          98: '#fff9ed',
          99: '#fffbff',
          100: '#ffffff',
        },
        'secondary': {
          0: '#000000',
          10: '#211b04',
          20: '#373016',
          25: '#423b20',
          30: '#4e472b',
          35: '#5a5235',
          40: '#665e40',
          50: '#807757',
          60: '#9a916f',
          70: '#b5ab88',
          80: '#d1c6a2',
          90: '#eee2bc',
          95: '#fdf0ca',
          98: '#fff9ee',
          99: '#fffbff',
          100: '#ffffff',
        },
        'error': {
          0: '#000000',
          10: '#410002',
          20: '#690005',
          25: '#7e0007',
          30: '#93000a',
          35: '#a80710',
          40: '#ba1a1a',
          50: '#de3730',
          60: '#ff5449',
          70: '#ff897d',
          80: '#ffb4ab',
          90: '#ffdad6',
          95: '#ffedea',
          98: '#fff8f7',
          99: '#fffbff',
          100: '#ffffff',
        },
        'error-container': {
          0: '#000000',
          10: '#98000a',
          20: '#ffaea4',
        },
        // Add more color categories as needed...
      },
    },

    
    'body': ['"Work Sans"'],
  },
 
  plugins: [],
}

