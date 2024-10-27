/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        "bounce-vertical": {
          '0%, 100%': {transform: "translateY(-25%)"},
          '50%': {"animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)"}
          }
        },
      screens: {
        "xs": '0px',
      }
    },
  },
  plugins: [],
}

