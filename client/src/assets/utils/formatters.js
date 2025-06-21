// Format seconds into MM:SS or HH:MM:SS
export const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds === null) return "00:00";

  seconds = Math.floor(seconds);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
  }

  return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
};

// Add leading zero to single-digit numbers
const padZero = (num) => {
  return num.toString().padStart(2, "0");
};

// Format date to human-readable string
export const formatDate = (dateString) => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Format file size in human-readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
