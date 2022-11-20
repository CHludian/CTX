/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,js,vue}",
        './node_modules/tw-elements/dist/js/**/*.js'
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('tw-elements/dist/plugin'),
        require("daisyui"),
    ],

    daisyui: {
        prefix: "dai-"
    }
}
