/**
 * Converts an image file to base64 string for storage
 * @param {File} file - The image file to convert
 * @param {number} maxSizeKB - Maximum size in KB (default 500KB)
 * @returns {Promise<string>} - Base64 encoded string
 */
export const convertImageToBase64 = (file, maxSizeKB = 500) => {
  return new Promise((resolve, reject) => {
    // Check file size
    if (file.size > maxSizeKB * 1024) {
      reject(new Error(`File size exceeds ${maxSizeKB}KB limit`));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Resize an image to fit within maximum dimensions while preserving aspect ratio
 * @param {File} file - The image file to resize
 * @param {Object} options - Resize options
 * @param {number} options.maxWidth - Maximum width in pixels (default 1280)
 * @param {number} options.maxHeight - Maximum height in pixels (default 720)
 * @param {number} options.quality - JPEG quality 0-1 (default 0.8)
 * @returns {Promise<Blob>} - Resized image as Blob
 */
export const resizeImage = (
  file,
  { maxWidth = 1280, maxHeight = 720, quality = 0.8 } = {}
) => {
  return new Promise((resolve, reject) => {
    // Create image object to get dimensions
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;

      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.floor(height * (maxWidth / width));
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.floor(width * (maxHeight / height));
          height = maxHeight;
        }

        // Create canvas and draw resized image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Process thumbnail for upload to Google Sheets
 * @param {File} file - The thumbnail file
 * @returns {Promise<string>} - Processed base64 string
 */
export const processThumbnailForUpload = async (file) => {
  try {
    // First resize the image
    const resizedImage = await resizeImage(file, {
      maxWidth: 640, // YouTube thumbnail recommended size
      maxHeight: 480,
      quality: 0.85,
    });

    // Convert to base64
    const base64String = await convertImageToBase64(
      new File([resizedImage], file.name, { type: "image/jpeg" }),
      400 // Allow up to 400KB after resize
    );

    return base64String;
  } catch (error) {
    console.error("Error processing thumbnail:", error);
    throw error;
  }
};
