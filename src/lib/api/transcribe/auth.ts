import api from '@/lib/api/transcribe';
import { dataTranscriberAuth, saveToken } from '@/lib/api/utils';

export async function getTranscriberToken(): Promise<string | null> {
  const data = JSON.stringify(dataTranscriberAuth());
  const url = '/auth/login';

  try {
    const response = await api.post(url, data);
    const token = response.data?.access_token;
    if (token) {
      saveToken('stt-service-token', token);
      return token;
    }
    console.warn('No token in response:', response.data);
    return null;
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
}
