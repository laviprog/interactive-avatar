import api from '@/lib/api/transcribe';

export async function transcribe(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', 'small');
  formData.append('result_format', 'text');
  formData.append('align_mode', 'false');
  formData.append('audio_preprocessing', 'false');

  try {
    const res = await api.post('/transcription/transcribe', formData, {
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
