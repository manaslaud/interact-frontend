import { toast, Id, ToastOptions, UpdateOptions } from 'react-toastify';

class Toaster {
  static toastSettings: ToastOptions = {
    containerId: 'main',
    // toastId: 'default',
    position: 'top-center',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'light',
  };

  static success(message: string): Id {
    return toast.success(message, this.toastSettings);
  }

  static error(message: string): Id {
    return toast.error(message, this.toastSettings);
  }

  static startLoad(message = 'Loading...'): Id {
    return toast.loading(message, this.toastSettings);
  }

  static stopLoad(loader: Id, message: string, res: number): void {
    const settings: UpdateOptions = { ...this.toastSettings };
    settings.render = message;
    settings.type = res === 1 ? 'success' : 'error';
    settings.isLoading = false;
    toast.update(loader, settings);
  }
}

export const messageToastSettings: ToastOptions = {
  containerId: 'messaging',
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

export default Toaster;
