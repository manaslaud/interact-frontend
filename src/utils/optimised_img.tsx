import React from 'react';
import Image from 'next/image';

type SIZE = 'sm' | 'md' | 'lg';

interface Props {
  src: string; //* src without extension name
  alt: string;
  size?: SIZE;
  className: string;
}

const BASE_EXT = 'jpg';

const OptimisedImg = ({ src, alt, size = 'lg', className }: Props) => {
  const getResizedPath = (): string => {
    return `${src}_${size}.${BASE_EXT}`;
  };

  return <Image crossOrigin="use-credentials" src={src} alt={alt} width={10000} height={10000} className={className} />;
};

export default OptimisedImg;
