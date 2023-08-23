import { PROJECT_PIC_URL } from '@/config/routes';
import { CarouselProvider, Slider, Dot, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface Props {
  imageURLs: string[];
}

const NewPostImages = ({ imageURLs }: Props) => {
  return (
    <CarouselProvider
      naturalSlideHeight={500}
      naturalSlideWidth={1000}
      totalSlides={imageURLs.length}
      visibleSlides={1}
      infinite={true}
      dragEnabled={true}
      isPlaying={false}
      className="w-1/2 h-full text-white flex items-center justify-center"
    >
      <Slider className="w-full">
        {imageURLs.map((el, index) => {
          return (
            <Slide index={index} key={index} className="w-full h-full text-center flex items-center justify-center ">
              <Image width={10000} height={10000} alt="quotes" src={el} className="w-full object-contain" />
            </Slide>
          );
        })}
      </Slider>
      <div className="absolute bottom-2">
        {imageURLs.map((_, i) => {
          return <Dot key={i} slide={i} />;
        })}
      </div>
    </CarouselProvider>
  );
};

export default NewPostImages;
