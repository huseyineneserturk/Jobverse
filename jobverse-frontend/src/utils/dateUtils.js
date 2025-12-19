// src/utils/dateUtils.js

export const timeAgo = (dateString) => {
  if (!dateString) return "-";
  
  const now = new Date();
  const postedDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - postedDate) / 1000);

  const minute = 60;
  const hour = 3600;
  const day = 86400;
  const month = 2592000;
  const year = 31536000;

  if (diffInSeconds < 0) return "Yakında";
  if (diffInSeconds < minute) return "Az önce";
  if (diffInSeconds < hour) return `${Math.floor(diffInSeconds / minute)} dakika önce`;
  if (diffInSeconds < day) return `${Math.floor(diffInSeconds / hour)} saat önce`;
  if (diffInSeconds < month) return `${Math.floor(diffInSeconds / day)} gün önce`;
  if (diffInSeconds < year) return `${Math.floor(diffInSeconds / month)} ay önce`;
  return `${Math.floor(diffInSeconds / year)} yıl önce`;
};