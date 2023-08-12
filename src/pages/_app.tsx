import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer containerId="main" limit={1} />
      <ToastContainer containerId="messaging" limit={5} />
      <Component {...pageProps} />
    </>
  );
}
