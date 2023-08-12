import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        "108": "32rem",
      },
      height: {
        "108": "32rem",
      },
      boxShadow: {
        custom: "0 25px 100px -30px rgb(0 0 0 / 0.25);",
        inner: "inset 0px 0px 200px 100px rgb(0,0,0,0.8);",
      },
      extend: {
        fontFamily: {
          PoiretOne: ["Poiret One"],
          Impact: ["Impact"],
          Helvetica: ["Helvetica"],
          Inconsolata: ["Inconsolata"],
          Imprima: ["Imprima"],
        },
        fontSize: {
          xxs: "0.5rem",
        },
        lineClamp: {
          7: "7",
          8: "8",
          9: "9",
          10: "10",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
export default config;
