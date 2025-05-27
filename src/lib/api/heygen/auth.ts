import api from '@/lib/api/heygen';

export async function fetchToken(): Promise<string> {
  const res = await api.post('/v1/streaming.create_token');
  return res.data.data.token;
}
