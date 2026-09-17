/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#ad5cac',
        'primary-soft': '#faf4fa',
        page: '#f7f7f8',
        heading: '#333333',
        text: '#4b4b4b',
        muted: '#777777',
        border: '#e3dce5',
      },
    },
  },
  plugins: [],
}
