/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/flowbite/**/*.{js,ts,jsx,tsx}",
        "./node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-purple': '#8B5CF6',
            },
        },
    },
    plugins: [require("flowbite/plugin")],
};