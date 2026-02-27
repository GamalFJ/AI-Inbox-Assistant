import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                brand: {
                    yellow: "#FAE588",
                    orange: "#FF8559",
                    slate: "#545F66",
                    dark: "#2A3034",
                    darker: "#1C2023",
                    card: "#353C40",
                    border: "#444D53",
                    purple: "#A64DFF",
                },
            },
        },
    },
    plugins: [],
};
export default config;
