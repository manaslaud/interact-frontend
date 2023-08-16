import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        108: '32rem',
        navigation: '347px',
        base: 'calc(100vw - 694px)',
      },
      height: {
        108: '32rem',
        navbar: '55px',
        base: 'calc(100vh - 55px)',
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
