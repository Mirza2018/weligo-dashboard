export const getBaseUrl = () => {
  return import.meta.env.VITE_PUBLIC_SERVER_URL;
};

export const getImageUrl = (key: string | undefined): string | null => {
  if (!key) return import.meta.env.VITE_PUBLIC_IMAGE_URL;
  return import.meta.env.VITE_PUBLIC_IMAGE_URL + key;
};

export const getSocketUrl = () => {
  return import.meta.env.VITE_PUBLIC_SOCKET_URL;
};

export const googleApiKey = () => {
  return import.meta.env.VITE_PUBLIC_GOOGLE_API;
};
