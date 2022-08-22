export default {
  methods: {
    // eslint-disable-next-line consistent-return
    async OptimizeImage(fileInput, originalFile, maxWidth = 1024, maxHeight = 1024, quality = 0.9) {
      await new Promise((resolve) => {
        if (!originalFile) {
          resolve();
          return;
        }
        const isImage = originalFile.type.startsWith('image');
        console.log(originalFile.type, isImage);
        if (!isImage) {
          resolve();
          return;
        }
        const img = document.createElement('img');
        const canvas = document.createElement('canvas');
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
          // eslint-disable-next-line consistent-return
          img.onload = () => {
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            if (img.width < maxWidth && img.height < maxHeight) {
              // Resize not required
              resolve();
              return;
            }
            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            const width = Math.round(img.width * ratio);
            const height = Math.round(img.height * ratio);
            canvas.width = width;
            canvas.height = height;

            ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
              const resizedFile = new File([blob], `resized_${originalFile.name}`, originalFile);
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(resizedFile);
              // temporary disable event listener, change and restore
              fileInput.files = dataTransfer.files;
              resolve();
            }, 'image/jpeg', quality);
          };
        };
        reader.readAsDataURL(originalFile);
      });
    },
  },
};