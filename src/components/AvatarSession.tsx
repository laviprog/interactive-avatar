import { forwardRef } from 'react';
import Button from '@/components/Button';
import { AvatarSessionState } from '@/logic/context';
import { useInterrupt } from '@/hooks/useInterrupt';
import { useInteractiveAvatarSession } from '@/hooks/useInteractiveAvatarSession';
import Chat, { ChatProps } from '@/components/Chat';

export const AvatarSession = forwardRef<HTMLVideoElement, ChatProps>(
  ({ handleMessage, language }, ref) => {
    const { sessionState, stopAvatar } = useInteractiveAvatarSession();
    const { interrupt } = useInterrupt();

    return (
      <div className="bg-[var(--dark)] rounded-xl flex flex-col justify-center w-full max-w-[1400px] max-h-[824px]">
        <div className="m-4 rounded-lg relative aspect-[16/9] overflow-hidden bg-[var(--black)]">
          {sessionState === AvatarSessionState.CONNECTED ? (
            <video
              ref={ref}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            >
              <track kind="captions" />
            </video>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="flex w-full justify-center gap-5">
          <div className='flex items-center justify-center gap-5 font-medium'>
          <Button className="px-7 py-3" onClick={stopAvatar}>
            Завершить сессию
          </Button>
          <Button className="px-7 py-3" onClick={interrupt}>
            Прервать аватара
          </Button>
          </div>
          <Chat handleMessage={handleMessage} language={language} />
        </div>
      </div>
    );
  }
);

AvatarSession.displayName = 'AvatarSession';
