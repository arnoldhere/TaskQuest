module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // paths to all your source files
  ],
  safelist: [
    'border-border', // add your custom class names that should always be included
  ],
  theme: {
    extend: {
      colors: {
        "dark-purple": "#081A51",
        "light-white": "rgba(255,255,255,0.17)",
      },
    }, // extend the default theme with custom values if needed
  },
  plugins: [], // add any plugins if needed
};
