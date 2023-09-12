import { resizeImage } from '@/utils/resize_image';
import Toaster from '@/utils/toaster';
import React, { useState } from 'react';
import Image from 'next/image';
import { PROJECT_PIC_URL } from '@/config/routes';

interface Props {
  setSelectedFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  initialImage?: string;
}

const Images = ({ setSelectedFile, initialImage }: Props) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(
    initialImage ? `${PROJECT_PIC_URL}/${initialImage}` : ''
  );
  return (
    <div className="w-full max-md:h-full max-md:py-2 overflow-auto flex flex-col items-center gap-4">
      <input
        type="file"
        className="hidden"
        id="image"
        multiple={false}
        onChange={async ({ target }) => {
          if (target.files && target.files.length > 0) {
            if (target.files[0].type.split('/')[0] === 'image') {
              try {
                const resizedPic = await resizeImage(target.files[0], 1080, 1080);
                setSelectedImageUrl(URL.createObjectURL(resizedPic));
                setSelectedFile(resizedPic);
              } catch (error) {
                console.error('Error while resizing image:', error);
                return null;
              }
            } else {
              Toaster.error('Only Images allowed');
              return null;
            }
          }
        }}
      />

      <label htmlFor="image">
        {selectedImageUrl == '' ? (
          <div className="rounded-xl w-80 max-md:w-56 h-80 max-md:h-56 bg-[#fffcea] flex-center transition-ease-500 cursor-pointer hover:bg-[#fff7cb]">
            add Image
          </div>
        ) : (
          <Image
            crossOrigin="anonymous"
            width={10000}
            height={10000}
            alt="project cover"
            src={selectedImageUrl}
            className="rounded-xl w-80 max-md:w-56 h-80 max-md:h-56 cursor-pointer object-contain"
          />
        )}
      </label>
    </div>
  );
};

export default Images;
