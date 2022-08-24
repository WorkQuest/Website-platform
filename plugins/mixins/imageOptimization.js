export default {
  methods: {
    // eslint-disable-next-line consistent-return
    async OptimizeImage(fileInput, originalFile, maxWidth = 1024, maxHeight = 1024, quality = 1) {
      await new Promise((resolve) => {
        if (!originalFile) {
          console.log('not file');
          resolve();
          return;
        }
        const isImage = originalFile.type.startsWith('image');
        if (!isImage) {
          console.log('not image');
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

            let w = img.width;
            let h = img.height;

            if ((w > maxWidth) || (h > maxHeight)) {
              const ratio = Math.min(maxWidth / w, maxHeight / h);
              w = Math.round(w * ratio);
              h = Math.round(h * ratio);
            }

            canvas.width = w;
            canvas.height = h;
            ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
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
