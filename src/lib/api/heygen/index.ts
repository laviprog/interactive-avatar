import axios from 'axios';
import { baseApiUrlHeyGen, heyGenApiKey } from '@/lib/api/utils';

const api = axios.create({
  baseURL: baseApiUrlHeyGen(),
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': heyGenApiKey(),
  },
});

export default api;
