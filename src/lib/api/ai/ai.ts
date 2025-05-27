import { baseApiUrlAi } from '@/lib/api/utils';
import { SSE } from 'sse.js';

export async function chatCompletions(
  userRequest: string,
  onData: (text: string, end?: boolean) => void,
  model: string = 'avatar-model-1',
  role: string = 'user',
  keepAlive: number = 60
): Promise<void> {
  const content = userRequest;

  const token = localStorage.getItem('token-ai');

  const endpoint = baseApiUrlAi() + '/api/chat/completions';

  const data = {
    model: model,
    stream: true,
    'keep-alive': keepAlive,
    messages: [
      {
        role: role,
        content:
          'Отвечай на запросы пользователя кратко и по делу. Не используй символы разметки. Запрос клиента: ' +
          content,
      },
    ],
    files: [
      {
        type: 'collection',
        id: 'fd190154-3169-4ea6-8e76-4dda041b3c1c',
      },
    ],
  };

  const source = new SSE(endpoint, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    payload: JSON.stringify(data),
    method: 'POST',
    start: false,
  });

  source.addEventListener('message', (mes: MessageEvent) => {
    const { data } = mes;

    try {
      const body = JSON.parse(data);
      const chunk = body.choices[0].delta.content;
      if (chunk) onData(chunk === '\n' ? ' ' : chunk);
    } catch {
      if (data == '[DONE]') onData('', true);
    }
  });

  source.stream();
}
