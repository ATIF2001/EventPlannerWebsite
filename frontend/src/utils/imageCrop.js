export async function getCroppedImageFile(
  imageSrc,
  cropPixels,
  fileName = "cropped-image.jpg",
  outputSize
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const targetWidth = Math.max(1, Math.round(outputSize?.width || cropPixels.width));
  const targetHeight = Math.max(1, Math.round(outputSize?.height || cropPixels.height));

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  if (!blob) throw new Error("Failed to create cropped image blob");

  return new File([blob], fileName, { type: "image/jpeg" });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}
