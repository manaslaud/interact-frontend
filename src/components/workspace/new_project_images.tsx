import { resizeImage } from '@/utils/resize_image';
import Toaster from '@/utils/toaster';
import React, { useState } from 'react';
import Image from 'next/image';

interface Props {
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const Images = ({ setSelectedFiles }: Props) => {
  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);
  return (
    <div className="w-full h-screen overflow-auto flex flex-col items-center gap-4">
      <div>Images {selectedImageUrls.length + '/' + '3'}</div>
      {selectedImageUrls.map((img, index) => {
        return (
          <div key={img} className="relative">
            <div
              onClick={() => {
                setSelectedFiles(prev => prev.filter((file, i) => i != index));
                setSelectedImageUrls(prev => prev.filter((img, i) => i != index));
              }}
              className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-pointer"
            >
              X
            </div>
            <Image width={10000} height={10000} alt="quotes" src={img} className="w-80 h-80 object-contain" />
          </div>
        );
      })}
      <input
        type="file"
        className="hidden"
        id="image"
        multiple={true}
        onChange={async ({ target }) => {
          if (target.files && target.files.length > 0) {
            if (target.files.length + selectedImageUrls.length > 3) {
              Toaster.error('Can add at most 3 photos.');
              return;
            }
            const resizedImages = await Promise.all(
              Array.from(target.files).map(async file => {
                if (file.type.split('/')[0] === 'image') {
                  try {
                    const resizedPic = await resizeImage(file, 720, 720);
                    return resizedPic;
                  } catch (error) {
                    console.error('Error while resizing image:', error);
                    return null;
                  }
                } else {
                  Toaster.error('Only Images allowed');
                  return null;
                }
              })
            );

            const filteredResizedImages = resizedImages.filter(img => img !== null);

            setSelectedImageUrls(prev => [
              ...prev,
              ...filteredResizedImages.map(img => URL.createObjectURL(img as File)),
            ]);
            setSelectedFiles(prev => [...prev, ...(filteredResizedImages.filter(img => img !== null) as File[])]);
          }
        }}
      />
      {selectedImageUrls.length < 3 ? (
        <label htmlFor="image">
          <div
            className={
              'rounded-xl w-80 h-80 bg-[#fffcea] flex flex-col items-center justify-center transition-ease-500 cursor-pointer hover:scale-105 hover:bg-[#fff7cb]'
            }
          >
            add Image
          </div>
        </label>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Images;
