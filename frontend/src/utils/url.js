export const getImageUrl = (path) => {
  if (!path) return '';
  
  // If the path is already a full URL (starts with http:// or https://), return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  const baseUrl = import.meta.env.VITE_API_URL || '';
  
  // Clean slashes: remove trailing slashes from baseUrl, leading slashes from path
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  
  // Return the combined URL, falling back to relative path if baseUrl is not configured
  return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
};
