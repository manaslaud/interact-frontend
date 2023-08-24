import { CarouselProvider, Slider, Dot, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import React, { useState } from 'react';
import Image from 'next/image';
import Toaster from '@/utils/toaster';
import { resizeImage } from '@/utils/resize_image';

interface Props {
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const NewPostImages = ({ setSelectedFiles }: Props) => {
  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);

  return (
    <>
      <input
        type="file"
        className="hidden"
        id="image"
        multiple={true}
        onChange={async ({ target }) => {
          if (target.files && target.files.length > 0) {
            if (target.files.length + selectedImageUrls.length > 5) {
              Toaster.error('Can add at most 5 photos.');
              return;
            }
            const resizedImages = await Promise.all(
              Array.from(target.files).map(async file => {
                if (file.type.split('/')[0] === 'image') {
                  try {
                    const resizedPic = await resizeImage(file, 1280, 720);
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
      <label htmlFor="image">
        <div
          className={
            'rounded-full w-12 h-12 bg-[#292929] flex flex-col items-center justify-center transition-ease-500cursor-pointer hover:scale-110 hover:bg-[#3b3b3b]'
          }
        >
          add Image
        </div>
      </label>
      <CarouselProvider
        naturalSlideHeight={500}
        naturalSlideWidth={1000}
        totalSlides={selectedImageUrls.length}
        visibleSlides={1}
        infinite={true}
        dragEnabled={true}
        isPlaying={false}
        className="w-1/2 h-full text-white flex items-center justify-center"
      >
        <Slider className="w-full">
          {selectedImageUrls.map((el, index) => {
            return (
              <Slide index={index} key={index} className="w-full h-full text-center flex items-center justify-center ">
                <div className="relative">
                  <div
                    onClick={() => {
                      setSelectedFiles(prev => prev.filter((file, i) => i != index));
                      setSelectedImageUrls(prev => prev.filter((img, i) => i != index));
                    }}
                    className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    X
                  </div>
                  <Image width={10000} height={10000} alt="quotes" src={el} className="w-full object-contain" />
                </div>
              </Slide>
            );
          })}
        </Slider>
        <div className="absolute bottom-2">
          {selectedImageUrls.map((_, i) => {
            return <Dot key={i} slide={i} />;
          })}
        </div>
      </CarouselProvider>
    </>
  );
};

export default NewPostImages;
