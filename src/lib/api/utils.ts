export function baseApiUrlHeyGen() {
  return process.env.NEXT_PUBLIC_BASE_API_URL_HEY_GEN;
}

export function heyGenApiKey() {
  return process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
}

export function baseApiUrlAi() {
  return process.env.NEXT_PUBLIC_BASE_API_URL_AI;
}

export function baseApiUrlTranscribe() {
  return process.env.NEXT_PUBLIC_BASE_API_URL_TRANSCRIBER;
}

export function dataAiAuth() {
  return {
    email: process.env.NEXT_PUBLIC_EMAIL_API_AI,
    password: process.env.NEXT_PUBLIC_PASSWORD_API_AI,
  };
}

export function dataTranscriberAuth() {
  return {
    username: process.env.NEXT_PUBLIC_USERNAME_API_TRANSCRIBER,
    password: process.env.NEXT_PUBLIC_PASSWORD_API_TRANSCRIBER,
  };
}

export function saveToken(key: string, token: string) {
  localStorage.setItem(key, token);
}

export function getToken(key: string) {
  return localStorage.getItem(key);
}
