import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store, persistor } from '@/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import NProgressConfig from '@/config/nprogress';
import socketService from '@/config/ws';

NProgressConfig();

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    socketService.connect();
    // socketService.setupChatNotifications();
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer containerId="main" />
          <ToastContainer containerId="messaging" limit={5} />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}
