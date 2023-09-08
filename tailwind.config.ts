import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      width: {
        108: '32rem',
        sidebar_open: '320px',
        sidebar_close: '100px',
        base_open: 'calc(100vw - 640px)',
        base_close: 'calc(100vw - 420px)',
        no_side_base_open: 'calc(100vw - 320px)',
        no_side_base_close: 'calc(100vw - 100px)',
        taskbar: '720px',
        taskbar_md: '90%',
        bottomBar: '100px',
      },
      height: {
        108: '32rem',
        navbar: '64px',
        base: 'calc(100vh - 64px)',
        taskbar: '48px',
        base_md: 'calc(100vh - 64px - 48px)',
      },
      minHeight: {
        base_md: 'calc(100vh - 64px - 48px)',
      },
      spacing: {
        navbar: '64px',
        base_padding: '24px',
        bottomBar: '100px',
        base_md: 'calc(100vh - 64px - 48px)',
      },

      boxShadow: {
        outer: '0 0 15px 2px #262626a1;',
        inner: '0px 0px 10px 1px #262626a1 inset;',
      },
      backgroundImage: {
        onboarding: "url('/assets/onboarding.png')",
        new_post: "url('/assets/new_post.png')",
      },
      colors: {
        primary_gradient_start: '#633267',
        primary_gradient_end: '#5b406b',
        secondary_gradient_start: '#be76bf',
        secondary_gradient_end: '#607ee7',
        primary_btn: '#9275b9ba',
      },
      backgroundColor: {
        backdrop: '#0000007f',
        navbar: '#070615be',
        main: '#070615be',
        sidebar: '#43434385',
      },
      fontFamily: {
        primary: ['var(--inter-font)'],
      },
      fontSize: {
        xxs: '0.5rem',
      },
      animation: {
        fade_third: 'fade 0.3s ease-in-out',
        fade_third_delay: 'fade 0.3s ease-in-out 0.5s',
        fade_half: 'fade 0.5s ease-in-out',
        fade_1: 'fade 1s ease-in-out',
        fade_2: 'fade 2s ease-in-out',
        shrink: 'shrink 0.1s ease-in-out 0.4s forwards',
      },
      keyframes: {
        shrink: {
          '0%': { scale: '100%' },
          '100%': { scale: '0%' },
        },
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
