

export function getViewableUrl(storedUrl: string): string {
  if (storedUrl.startsWith("CLOUDINARY_RAW:")) {
    
    const publicId = storedUrl.replace("CLOUDINARY_RAW:", "");
    
    const encodedId = encodeURIComponent(publicId);
    return `/api/documents/${encodedId}`;
  }
  return storedUrl;
}
