export const MAX_RECORDING_LENGTH = 60 * 10; // 10 minutes in seconds

export const SNIPPET_TYPES = {
  VOICE: "voice",
  MUSIC: "music",
  MEMO: "memo",
};

export const SHARE_EXPIRATION_OPTIONS = [
  { value: "1h", label: "1 Hour" },
  { value: "24h", label: "24 Hours" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "never", label: "Never" },
];

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    CURRENT_USER: "/auth/me",
  },
  SNIPPETS: {
    BASE: "/snippets",
    SINGLE: (id) => `/snippets/${id}`,
  },
  SHARE: {
    CREATE: "/share",
    GET: (id) => `/share/${id}`,
  },
};
