/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {},
      borderColor: {
        standard: 'rgb(229, 231, 235)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
