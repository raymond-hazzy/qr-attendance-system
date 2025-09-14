export const getProfileImageUrl = (imagePath: string | undefined | null): string | null => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  return `http://localhost:5000/${cleanPath}`;
};