'use client';

import {
  AvatarQuality,
  ElevenLabsModel,
  StartAvatarRequest,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from '@heygen/streaming-avatar';
import { AVATARS, LANGUAGE_LIST } from '@/data/avatars';
import { useInteractiveAvatarSession } from '@/hooks/useInteractiveAvatarSession';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getTranscriberToken } from '@/lib/api/transcribe/auth';
import { fetchToken } from '@/lib/api/heygen/auth';
import { AvatarSessionState, Message } from '@/logic/context';
import Chat from '@/components/Chat';
import AvatarConfig from '@/components/AvatarConfig';
import { AvatarSession } from '@/components/AvatarSession';

const DEFAULT_CONFIG: StartAvatarRequest = {
  quality: AvatarQuality.Low,
  avatarName: AVATARS[0].avatar_id,
  knowledgeId: undefined,
  voice: {
    rate: 1.5,
    emotion: VoiceEmotion.FRIENDLY,
    model: ElevenLabsModel.eleven_flash_v2_5,
  },
  language: LANGUAGE_LIST[0].key,
};

export default function InteractiveAvatar() {
  const {
    avatarRef,
    initAvatar,
    startAvatar,
    sessionState,
    stream,
    handleUserMessage,
    setWaiting,
  } = useInteractiveAvatarSession();

  const [config, setConfig] = useState<StartAvatarRequest>(DEFAULT_CONFIG);

  const mediaStream = useRef<HTMLVideoElement>(null);

  const sendMessage = useCallback(
    (message: string) => {
      if (!avatarRef.current) return;
      avatarRef.current.speak({
        text: message,
        taskType: TaskType.TALK,
        taskMode: TaskMode.SYNC,
      });
    },
    [avatarRef]
  );

  function handleMessage(message: Message) {
    setWaiting(true);
    handleUserMessage(message);
    sendMessage(message.content);
  }

  async function startSession() {
    try {
      const newToken = await fetchToken();
      await getTranscriberToken();

      const avatar = initAvatar(newToken);

      avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
        console.info('Avatar started talking', e);
      });

      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
        console.info('Avatar stopped talking', e);
      });

      avatar.on(StreamingEvents.STREAM_DISCONNECTED, (e) => {
        console.info('Stream disconnected', e);
      });

      avatar.on(StreamingEvents.STREAM_READY, () => {
        console.info('>>>>> Stream ready');
      });

      avatar.on(StreamingEvents.USER_START, () => {
        console.info('>>>>> User started talking');
      });

      avatar.on(StreamingEvents.USER_STOP, () => {
        console.info('>>>>> User stopped talking');
      });

      await startAvatar(config);
    } catch (error) {
      console.error('Error starting avatar session:', error);
    }
  }

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream
          .current!.play()
          .then(() => console.log('Playing'))
          .catch((e) => console.warn('Failed to play media:', e));
      };
    }
  }, [mediaStream, stream]);

  return (
    <div className="flex items-center w-full h-full">
      {sessionState !== AvatarSessionState.INACTIVE ? (
        <div className="flex justify-center items-center w-full h-full">
          <div className="flex w-full gap-5 m-5 2xl:h-220 xl:h-200 lg:h-170 h-100">
            <div className="flex-2 w-full h-full">
              <AvatarSession ref={mediaStream} />
            </div>
            <Chat className="flex-1" handleMessage={handleMessage} language={config.language} />
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-center">
          <AvatarConfig config={config} onConfigChange={setConfig} startSession={startSession} />
        </div>
      )}
    </div>
  );
}
