import clsx from 'clsx';
import Button from '@/components/Button';
import { Message, MessageSender } from '@/logic/context';
import { useEffect, useRef, useState } from 'react';
import { transcribe } from '@/lib/api/transcribe/transcribe';
import { toast } from 'react-toastify';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { SendHorizontal } from 'lucide-react';
import { useMessageHistory } from '@/hooks/useMessageHistory';
import { useInteractiveAvatarSession } from '@/hooks/useInteractiveAvatarSession';

interface ChatProps {
  className?: string;
  handleMessage: (message: Message) => void;
  language: string | undefined;
}

export default function Chat({ className, handleMessage, language }: ChatProps) {
  const { messages } = useMessageHistory();

  const { waiting } = useInteractiveAvatarSession();

  const [message, setMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const onRecordingCompleteAction = (audioBlob: Blob) => {
    setIsTranscribing(true);
    const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
    transcribe(audioFile, language)
      .then((result) => {
        if (result === '') {
          toast.error('Не получилось распознать');
          return;
        }

        handleMessage({
          id: Date.now().toString(),
          sender: MessageSender.CLIENT,
          content: result,
        });
      })
      .catch(() => {
        toast.error('Не получилось распознать');
      })
      .finally(() => {
        setIsTranscribing(false);
      });
  };

  const handleSubmit = () => {
    if (message === '') return;

    handleMessage({
      id: Date.now().toString(),
      sender: MessageSender.CLIENT,
      content: message,
    });

    setMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={clsx('bg-[var(--dark)] rounded-xl flex flex-col h-full', className)}>
      <div className="overflow-y-auto bg-[var(--black)] m-5 mb-0 rounded-xl h-full">
        <div className="flex flex-col gap-2 h-full px-3 py-2">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={clsx(
                'flex w-full',
                message.sender === MessageSender.CLIENT && 'justify-end '
              )}
            >
              <div
                className={clsx(
                  'bg-[var(--dark)] rounded-lg max-w-5/6 overflow-hidden',
                  message.sender === MessageSender.CLIENT && 'items-start',
                  messages.length - 1 === index && 'mb-2'
                )}
              >
                <p className="p-2 [word-break:break-word] [overflow-wrap:anywhere]">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex gap-2 w-full p-5">
        <input
          type="text"
          className={clsx(
            'w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-gray-300'
          )}
          placeholder="Введите сообщение"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !waiting) {
              handleSubmit();
            }
          }}
        />

        <VoiceRecorder
          onRecordingCompleteAction={onRecordingCompleteAction}
          isLoading={isTranscribing}
        />

        <Button className="!p-2 !rounded-md" onClick={handleSubmit} disabled={waiting}>
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
}
