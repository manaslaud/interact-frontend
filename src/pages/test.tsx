import { useEffect, useState } from 'react';
import generateRandomProfilePicture from '@/utils/generate_profile_picture';
import Image from 'next/image';
import { GetServerSidePropsContext } from 'next/types';

const Home = () => {
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  useEffect(() => {
    const width = 1080;
    const height = 1080;

    generateRandomProfilePicture(width, height)
      .then(imageFile => {
        // Create a data URL for the download link
        const url = URL.createObjectURL(imageFile);

        // Set the download link in the state
        setDownloadLink(url);
      })
      .catch(error => console.error('Error generating gradient image:', error));
  }, []);

  return (
    <div>
      <Image className="w-[90vh] h-[90vh]" height={10000} width={10000} src={String(downloadLink)} alt="" />

      {downloadLink && (
        <div>
          <p>Generated Gradient Image:</p>
          <a href={downloadLink} download="gradient_image.png">
            Download Gradient Image
          </a>
        </div>
      )}

      <style jsx>{`
        canvas {
          border: 1px solid #000;
        }
      `}</style>
    </div>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  if (process.env.NODE_ENV != 'development') {
    return {
      redirect: {
        permanent: true,
        destination: '/home',
      },
      props: {},
    };
  }
  return {
    props: {},
  };
};

export default Home;
