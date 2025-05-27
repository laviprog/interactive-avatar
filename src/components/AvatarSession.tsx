import {forwardRef} from 'react';
import Button from '@/components/Button';
import { AvatarSessionState } from '@/logic/context';
import { useInterrupt } from '@/hooks/useInterrupt';
import {useInteractiveAvatarSession} from "@/hooks/useInteractiveAvatarSession";

export const AvatarSession = forwardRef<HTMLVideoElement>(({}, ref) => {
  const { sessionState, stopAvatar } = useInteractiveAvatarSession();
  const { interrupt } = useInterrupt();

  return (
    <div className='bg-[var(--dark)] rounded-xl flex flex-col justify-around w-full h-full'>
      <div className="m-4 rounded-lg relative aspect-[4/3] overflow-hidden bg-[var(--black)]">
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

      <div className="p-4 px-10 flex gap-5">
        <Button className="px-7 py-3" onClick={stopAvatar}>
          Завершить сессию
        </Button>
        <Button className="px-7 py-3" onClick={interrupt}>
          Прервать аватара
        </Button>
      </div>
    </div>
  );

  }
)

AvatarSession.displayName = 'AvatarSession';
