/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        "bounce-vertical": {
          '0%, 100%': {transform: "translateY(-25%)"},
          '50%': {"animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)"}
        },
      },
      screens: {
        "xs": '0px',
        '900px': '900px',
      }
    },
  },
  plugins: [],
}

