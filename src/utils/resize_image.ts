export const resizeImage = async (file: File, width: number, height: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        // Calculate the aspect ratio of the original image
        const originalAspectRatio = img.width / img.height;
        const cropAspectRatio = width / height;

        let sx = 0;
        let sy = 0;
        let sw = img.width;
        let sh = img.height;

        if (originalAspectRatio > cropAspectRatio) {
          // Original image is wider, crop the sides
          sw = img.height * cropAspectRatio;
          sx = (img.width - sw) / 2;
        } else {
          // Original image is taller, crop the top and bottom
          sh = img.width / cropAspectRatio;
          sy = (img.height - sh) / 2;
        }

        ctx?.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);

        canvas.toBlob(
          croppedBlob => {
            if (croppedBlob) {
              // Create a File object with the cropped blob
              const fileName = file.name;
              const croppedFile = new File([croppedBlob], fileName, { type: 'image/jpeg' });
              resolve(croppedFile);
            } else {
              reject(new Error('Failed to crop the image.'));
            }
          },
          'image/jpeg',
          1 // JPEG quality (0-1)
        );
      };

      img.onerror = error => {
        console.log(error);
        reject(new Error('Failed to load the image.'));
      };

      img.src = URL.createObjectURL(file);
    } catch (err) {
      console.log(err);
      reject(new Error('Error in Cropping: ' + err));
    }
  });
};
