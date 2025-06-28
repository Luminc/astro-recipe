module.exports = {
  content: [
    './src/**/*.{astro,js,jsx,ts,tsx,md}',
    './public/**/*.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
