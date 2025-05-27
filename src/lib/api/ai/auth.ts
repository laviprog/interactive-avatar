import api from '@/lib/api/ai';
import { dataAiAuth, saveToken } from '@/lib/api/utils';

export async function getAiToken(): Promise<string | null> {
  const data = JSON.stringify(dataAiAuth());

  try {
    const response = await api.post('/api/v1/auths/signin', data);

    const token = response.data?.token;

    if (token) {
      saveToken('token-ai', token);
      return token;
    }

    console.warn('No token in response:', response.data);
    return null;
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
}
