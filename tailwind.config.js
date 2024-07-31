/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./node_modules/flowbite/**/*.js",
    "index.html",
    "./dashboard/home.html",
    "./report/report.html",
    "./leaderboard/leaderboard.html",
    
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

