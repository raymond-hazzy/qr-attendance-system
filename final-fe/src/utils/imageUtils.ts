export const getProfileImageUrl = (imagePath: string | undefined | null): string | null => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return it
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Remove leading slash if present and construct full URL
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  return `http://localhost:5000/${cleanPath}`;
};