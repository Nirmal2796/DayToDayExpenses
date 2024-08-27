/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./node_modules/flowbite/**/*.js",
    "./public/index.html",
    "./public/dashboard/home.html",
    "./public/report/report.html",
    "./public/leaderboard/leaderboard.html",
    
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}


