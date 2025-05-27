import api from '@/lib/api/transcribe';

export async function transcribe(file: File, language: string | undefined): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await api.post('/transcription/transcribe', formData, {
      params: {
        language: language,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data?.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}
