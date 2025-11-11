import flowbitePlugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include your project's files
    "./node_modules/flowbite/**/*.js", // Include Flowbite's files
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        customGray: '#d4c4c4ec',
      },
    },
  },
  plugins: [
    flowbitePlugin, // Add Flowbite plugin
  ],
};

export default config;
