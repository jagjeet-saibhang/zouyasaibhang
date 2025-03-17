/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: "#383838",
        primary: "#095256",
        secondary: "#43AA8B",
        red: "#A22522",
        green: "#66BAA1",
        blue: "#227CA2",
        yellow: "#E79A28",
      },
      fontFamily: {
        pThin: ["Poppins-Thin", "sans-serif"],
        pExtraLight: ["Poppins-ExtraLight", "sans-serif"],
        pLight: ["Poppins-Light", "sans-serif"],
        pRegular: ["Poppins-Regular", "sans-serif"],
        pMedium: ["Poppins-Medium", "sans-serif"],
        pSemiBold: ["Poppins-SemiBold", "sans-serif"],
        pBold: ["Poppins-Bold", "sans-serif"],
        pExtraBold: ["Poppins-ExtraBold", "sans-serif"],
        pBlack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
