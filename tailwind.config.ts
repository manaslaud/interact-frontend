import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        108: '32rem',
        navigation_open: '347px',
        navigation_close: '100px',
      },
      height: {
        108: '32rem',
      },
      boxShadow: {
        custom: '0 25px 100px -30px rgb(0 0 0 / 0.25);',
        inner: 'inset 0px 0px 200px 100px rgb(0,0,0,0.8);',
      },
      backgroundImage: {
        onboarding: "url('/assets/onboarding.png')",
      },
      fontFamily: {
        primary: ['var(--inter-font)'],
      },
      fontSize: {
        xxs: '0.5rem',
      },
      animation: {
        fade: 'fade 1s ease-in-out',
      },
      keyframes: {
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      lineClamp: {
        7: '7',
        8: '8',
        9: '9',
        10: '10',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
export default config;
