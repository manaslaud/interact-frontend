import React, { ComponentType, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Toaster from '../utils/toaster';
// import BaseTemplate from '@/screens/baseTemplate';

const Protect = <Props extends Object>(Component: ComponentType<Props>) => {
  const ProtectedComponent = (props: Props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(0);
    useEffect(() => {
      if (!Cookies.get('token')) {
        Toaster.error('You are not logged in.');
        setIsAuthenticated(0);
        router.push('/login');
      } else setIsAuthenticated(1);
    }, []);

    if (isAuthenticated === 1) return <Component {...props} />;
    // return <BaseTemplate />;
    return null;
  };
  return ProtectedComponent;
};

export default Protect;
