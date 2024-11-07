import flowbitePlugin from "flowbite/plugin";
import scrollbarPlugin from "tailwind-scrollbar";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: [
    flowbitePlugin,
    scrollbarPlugin
  ]
};
