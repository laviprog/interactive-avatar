import api from '@/lib/api/transcribe';
import { dataTranscriberAuth, getToken, saveToken } from '@/lib/api/utils';

export async function getTranscriberToken(): Promise<string | null> {
  const refresh = getToken('refresh-transcriber');
  let data = JSON.stringify(dataTranscriberAuth());
  let url = '/auth/login';
  if (refresh) {
    url = '/auth/refresh';
    data = JSON.stringify({
      refresh_token: refresh,
    });
  }

  try {
    const response = await api.post(url, data);

    const token = response.data?.access_token;
    const refresh = response.data?.refresh_token;

    if (token && refresh) {
      saveToken('token-transcriber', token);
      saveToken('refresh-transcriber', refresh);
      return token;
    }

    console.warn('No token in response:', response.data);
    return null;
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
}
